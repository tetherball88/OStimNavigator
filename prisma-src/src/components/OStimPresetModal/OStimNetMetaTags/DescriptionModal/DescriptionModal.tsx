import { useEffect, useRef, useState } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useNavigatorStore } from '../../../../store/index'
import './DescriptionModal.css'
import { requestAutoDescriptionAsync, requestCustomDescriptionAsync, saveCustomDescriptionAsync, generateDescriptionAsync, GenerateDescriptionResult, notifyTextFocus } from '../../../../services/gameIntegration'

const DEV = import.meta.env.DEV

const MOCK_AUTO_DESCRIPTION = `A passionate encounter between two actors in a dominant/submissive dynamic.
The scene begins standing, transitioning to a floor position.
Actor 1 takes the dominant role throughout.
Tags: cowgirl, dom, romantic
Actions: vaginalsex, kissingneck, holdinghip`

const MOCK_CUSTOM_DESCRIPTION = `A passionate encounter between two actors in a dominant/submissive dynamic.
The scene begins standing, then moves to the bed.
Actor 1 takes the dominant role throughout.
Tags: cowgirl, dom, romantic, gentle
Actions: vaginalsex, kissingneck, holdinghip, strokinghead`

// ─── component ────────────────────────────────────────────────────────────────

interface DescriptionModalProps {
    sceneId: string
}

export function DescriptionModal({ sceneId }: DescriptionModalProps) {
    const setSceneHasCustomDescription = useNavigatorStore(state => state.setSceneHasCustomDescription)
    const autoEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const customEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const [autoDescription, setAutoDescription] = useState(DEV ? MOCK_AUTO_DESCRIPTION : '')
    const [customOverride, setCustomOverride] = useState(DEV ? MOCK_CUSTOM_DESCRIPTION : '')

    useEffect(() => {
        if (DEV) return
        setAutoDescription('')
        async function loadAutoDescription() {
            const description = await requestAutoDescriptionAsync(sceneId)
            setAutoDescription(description)
        }
        loadAutoDescription()
    }, [sceneId])

    useEffect(() => {
        if (DEV) return
        setCustomOverride('')
        async function loadCustomDescription() {
            const description = await requestCustomDescriptionAsync(sceneId)
            if (description) {
                setCustomOverride(description)
            }
        }
        loadCustomDescription()
    }, [sceneId])

    const [generating, setGenerating] = useState(false)
    const [generateError, setGenerateError] = useState<string | null>(null)
    const [showGenerateModal, setShowGenerateModal] = useState(false)
    const [additionalInstructions, setAdditionalInstructions] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'saved' | 'failed' | null>(null)
    const [copiedAuto, setCopiedAuto] = useState(false)
    const [copiedCustom, setCopiedCustom] = useState(false)

    function handleGenerate() {
        setGenerateError(null)
        setShowGenerateModal(true)
    }

    async function sendGenerate() {
        setShowGenerateModal(false)
        setGenerating(true)
        setGenerateError(null)
        const result: GenerateDescriptionResult = DEV
            ? { ok: true, text: 'LLM-generated description placeholder.' }
            : await generateDescriptionAsync(sceneId, additionalInstructions)
        setGenerating(false)
        if (result.ok) {
            setCustomOverride(result.text)
            customEditorRef.current?.setValue(result.text)
        } else {
            setGenerateError(result.error)
        }
    }

    async function handleSave() {
        setSaving(true)
        setSaveStatus(null)
        const ok = DEV ? true : await saveCustomDescriptionAsync(sceneId, customOverride)
        setSaving(false)
        setSaveStatus(ok ? 'saved' : 'failed')
        if (ok) setSceneHasCustomDescription(sceneId, customOverride.trim() !== '')
        setTimeout(() => setSaveStatus(null), 3000)
    }

    function handleCopyAuto() {
        const value = autoEditorRef.current?.getValue() ?? autoDescription
        navigator.clipboard.writeText(value).then(() => {
            setCopiedAuto(true)
            setTimeout(() => setCopiedAuto(false), 1800)
        })
    }

    // Sync editor content when value changes from an external source (load, generate).
    // The guard `getValue() !== newValue` prevents cursor reset while the user is typing,
    // because onDidChangeModelContent already keeps state and editor in sync.
    useEffect(() => {
        const ed = autoEditorRef.current
        if (ed && ed.getValue() !== autoDescription) ed.setValue(autoDescription)
    }, [autoDescription])

    useEffect(() => {
        const ed = customEditorRef.current
        if (ed && ed.getValue() !== customOverride) ed.setValue(customOverride)
    }, [customOverride])

    function handleCopyCustom() {
        const value = customEditorRef.current?.getValue() ?? customOverride
        navigator.clipboard.writeText(value).then(() => {
            setCopiedCustom(true)
            setTimeout(() => setCopiedCustom(false), 1800)
        })
    }

    const handleAutoMount: OnMount = (ed) => {
        autoEditorRef.current = ed
        autoEditorRef.current?.setValue(autoDescription)
        ed.onDidFocusEditorText(() => notifyTextFocus(true))
        ed.onDidBlurEditorText(() => notifyTextFocus(false))
    }

    const handleCustomMount: OnMount = (ed) => {
        customEditorRef.current = ed
        customEditorRef.current?.setValue(customOverride)
        ed.onDidFocusEditorText(() => notifyTextFocus(true))
        ed.onDidBlurEditorText(() => notifyTextFocus(false))
        ed.onDidChangeModelContent(() => {
            setCustomOverride(ed.getValue())
        })
    }

    // Close on Escape — removed (inline, no modal)

    const editorOptions: editor.IStandaloneEditorConstructionOptions = {
        minimap: { enabled: false },
        fontSize: 16,
        lineHeight: 22,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
        padding: { top: 8, bottom: 8 },
        renderLineHighlight: 'none',
        glyphMargin: false,
    }

    return (
        <div className="desc-editor">
            <div className="desc-editor-pane">
                <div className="desc-pane-label">
                    Auto Description
                    <button className="desc-generate-btn" onClick={handleCopyAuto}>
                        {copiedAuto ? '✓ Copied' : 'Copy'}
                    </button>
                </div>
                <div className="desc-pane-editor">
                    <Editor
                        value={autoDescription}
                        theme="vs-dark"
                        onMount={handleAutoMount}
                        options={{ ...editorOptions, readOnly: true }}
                    />
                </div>
            </div>

            <div className="desc-editor-divider" />

            <div className="desc-editor-pane">
                <div className="desc-pane-label">
                    Custom Override
                    {(() => {
                        const scene = useNavigatorStore.getState().scenes.find(s => s.id.toLowerCase() === sceneId.toLowerCase());
                        if (scene?.descriptionInherited) {
                            return (
                                <span style={{ color: '#4caf50', marginLeft: '8px', fontSize: '14px', fontWeight: 'normal' }}>
                                    (Inherited from OStim)
                                </span>
                            );
                        }
                        return null;
                    })()}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
                        <button
                        className={`desc-generate-btn${generating ? ' desc-generate-btn--loading' : ''}`}
                            onClick={handleGenerate}
                            disabled={generating}
                        >
                            {generating ? 'Generating…' : '✦ Generate'}
                        </button>
                        {generateError && (
                            <span className="desc-save-status desc-save-status--err" title={generateError}>✗ {generateError}</span>
                        )}
                        <button
                            className={`desc-generate-btn${saving ? ' desc-generate-btn--loading' : ''}`}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving…' : '💾 Save'}
                        </button>
                        {saveStatus === 'saved' && <span className="desc-save-status desc-save-status--ok">✓ Saved</span>}
                        {saveStatus === 'failed' && <span className="desc-save-status desc-save-status--err">✗ Failed</span>}
                        <button className="desc-generate-btn" onClick={handleCopyCustom}>
                            {copiedCustom ? '✓ Copied' : 'Copy'}
                        </button>
                    </div>
                    
                </div>
                <div className="desc-pane-editor">
                    <Editor
                        defaultValue={customOverride}
                        theme="vs-dark"
                        onMount={handleCustomMount}
                        options={editorOptions}
                    />
                </div>
            </div>

            {/* ── generate mini-modal ── */}
            {showGenerateModal && (
                <div className="gen-modal-backdrop" onClick={() => setShowGenerateModal(false)}>
                    <div className="gen-modal" onClick={e => e.stopPropagation()}>
                        <div className="gen-modal-title">Generate Description</div>
                        <label className="gen-modal-label">Additional instructions <span className="gen-modal-optional">(optional)</span></label>
                        <textarea
                            className="gen-modal-textarea"
                            placeholder="e.g. focus on emotions, keep it short, mention the furniture…"
                            value={additionalInstructions}
                            onChange={e => setAdditionalInstructions(e.target.value)}
                            rows={4}
                            autoFocus
                            onFocus={() => notifyTextFocus(true)}
                            onBlur={() => notifyTextFocus(false)}
                            onKeyDown={e => {
                                if (e.key === 'Escape') setShowGenerateModal(false)
                            }}
                        />
                        <div className="gen-modal-actions">
                            <button className="desc-generate-btn" onClick={() => setShowGenerateModal(false)}>Cancel</button>
                            <button className="desc-generate-btn desc-generate-btn--primary" onClick={sendGenerate}>✦ Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
