import { useEffect, useRef, useState } from 'react'
import Editor, { BeforeMount, OnMount, loader } from '@monaco-editor/react'
import type { Monaco } from '@monaco-editor/react'
import type { editor, languages } from 'monaco-editor'
import { SceneSuggestions } from '../../../store/types'
import { useNavigatorStore } from '../../../store/index'
import { requestSceneJsonAsync, saveSceneJsonAsync, notifyTextFocus } from '../../../services/gameIntegration'
import ostimSceneSchema from '../../../schemas/ostimSceneJsonSchema.json'
import './OStimJson.css'

const OSTIM_SCHEMA_URI = 'https://ostim/scene-schema.json'
const OSTIM_MODEL_PATH = 'ostim-scene.json'

// ─── schema helpers ───────────────────────────────────────────────────────────

function buildSchemaWithSuggestions(sugg: SceneSuggestions): object {
    const schema = JSON.parse(JSON.stringify(ostimSceneSchema)) as any
    const suggestItems = (vals: string[]) => ({ anyOf: [{ enum: vals }, { type: 'string' }] })
    for (const defName of ['OstimSceneTransition', 'OstimSceneWithNavigation']) {
        const def = schema.definitions[defName]
        const actionTypeProp = def.properties.actions.items.properties.type
        def.properties.actions.items.properties.type = {
            description: actionTypeProp.description,
            ...suggestItems(sugg.actionTypes),
        }
        def.properties.actors.items.properties.tags.items = suggestItems(sugg.actorTags)
        def.properties.tags.items = suggestItems(sugg.sceneTags)
    }
    return schema
}

function applyOStimSchema(monaco: Monaco, sugg: SceneSuggestions) {
    const schema = buildSchemaWithSuggestions(sugg)
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        enableSchemaRequest: false,
        schemaValidation: 'error',
        schemas: [{
            uri: OSTIM_SCHEMA_URI,
            fileMatch: [OSTIM_MODEL_PATH],
            schema,
        }],
    })
}

// ─── loader ───────────────────────────────────────────────────────────────────

const DEV = import.meta.env.DEV

async function loadOStimSceneJson(sceneId: string): Promise<string> {
    if (DEV) {
        const res = await fetch(`./mocks/AnubsFfmfemdom-3.json`)
        return await res.text()
    }
    return requestSceneJsonAsync(sceneId)
}

// ─── component ───────────────────────────────────────────────────────────────

interface OStimJsonProps {
    sceneId: string
}

export function OStimJson({ sceneId }: OStimJsonProps) {
    const suggestions = useNavigatorStore(state => state.sceneSuggestions)

    const [copied, setCopied] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'saved' | 'failed' | null>(null)
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const loadedValueRef = useRef<string | null>(null)
    const lineEndingRef = useRef<'\r\n' | '\n'>('\n')
    const lensDisposableRef = useRef<{ dispose: () => void } | null>(null)
    const cmdDisposableRef = useRef<{ dispose: () => void } | null>(null)
    // Always points to the latest handleSave so the registered Ctrl+S command
    // never closes over a stale sceneId when the modal stays open across scene changes.
    const handleSaveRef = useRef<() => void>(() => { })

    // Dispose CodeLens provider and global command when component unmounts
    useEffect(() => () => {
        lensDisposableRef.current?.dispose()
        cmdDisposableRef.current?.dispose()
    }, [])

    // Re-apply schema whenever the game sends updated suggestions
    useEffect(() => {
        loader.init().then(monaco => applyOStimSchema(monaco, suggestions))
    }, [suggestions])

    useEffect(() => {
        async function loadPreset() {
            const value = await loadOStimSceneJson(sceneId)
            lineEndingRef.current = value.includes('\r\n') ? '\r\n' : '\n'
            loadedValueRef.current = value
            editorRef.current?.setValue(value)
        }
        loadPreset()
    }, [sceneId])

    const handleBeforeMount: BeforeMount = (monaco) => {
        applyOStimSchema(monaco, suggestions)
        cmdDisposableRef.current = monaco.editor.registerCommand(
            'ostim-navigator.addAction',
            () => {
                const ed = editorRef.current
                if (!ed) return
                const value = ed.getValue()
                try {
                    const obj = JSON.parse(value)
                    if (!Array.isArray(obj.actions)) obj.actions = []
                    obj.actions.push({ actor: 0, type: '' })
                    const scrollTop = ed.getScrollTop()
                    ed.setValue(JSON.stringify(obj, null, 2))
                    ed.setScrollTop(scrollTop)
                } catch { /* invalid JSON – do nothing */ }
            },
        )
    }

    const handleEditorMount: OnMount = (ed, monaco) => {
        editorRef.current = ed

        ed.onDidFocusEditorText(() => notifyTextFocus(true))
        ed.onDidBlurEditorText(() => notifyTextFocus(false))

        ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            // Use the ref so we always call the latest handleSave (correct sceneId),
            // even when the modal stays open across scene navigation.
            handleSaveRef.current()
        })

        lensDisposableRef.current = monaco.languages.registerCodeLensProvider('json', {
            provideCodeLenses(model: editor.ITextModel) {
                if (!model.uri.path.endsWith(OSTIM_MODEL_PATH)) {
                    return { lenses: [], dispose: () => { } }
                }
                const lines = model.getLinesContent()
                for (let i = 0; i < lines.length; i++) {
                    if (/"actions"\s*:/.test(lines[i])) {
                        return {
                            lenses: [{
                                range: new monaco.Range(i + 1, 1, i + 1, 1),
                                id: 'add-action',
                                command: {
                                    id: 'ostim-navigator.addAction',
                                    title: '+ Add action',
                                },
                            }],
                            dispose: () => { },
                        }
                    }
                }
                return { lenses: [], dispose: () => { } }
            },
            resolveCodeLens(_model: editor.ITextModel, codeLens: languages.CodeLens) {
                return codeLens
            },
        })

        if (loadedValueRef.current !== null) {
            ed.setValue(loadedValueRef.current)
        }
    }

    async function handleSave() {
        const raw = editorRef.current?.getValue() ?? loadedValueRef.current ?? ''
        let value = raw
        try {
            const eol = lineEndingRef.current
            value = JSON.stringify(JSON.parse(raw), null, 4)
                .replace(/\r\n/g, '\n')
                .replace(/\n/g, eol)
            editorRef.current?.setValue(value)
        } catch {
            // not valid JSON — send as-is and let the backend reject it
        }
        const ok = DEV ? true : await saveSceneJsonAsync(sceneId, value)
        setSaveStatus(ok ? 'saved' : 'failed')
        setTimeout(() => setSaveStatus(null), 1800)
    }

    // Keep the ref pointing to the latest handleSave on every render,
    // so the one-time Ctrl+S command registration never calls a stale closure
    // when the modal stays open and sceneId changes via navigation.
    handleSaveRef.current = handleSave

    function handleCopy() {
        const value = editorRef.current?.getValue() ?? loadedValueRef.current ?? ''
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        })
    }

    return (
        <div className="ostim-json">
            <div className="ostim-json-toolbar">
                <button className="preset-btn preset-btn--save" onClick={handleSave}>
                    {saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'failed' ? '✗ Failed' : 'Save'}
                </button>
                <button className="preset-btn preset-btn--copy" onClick={handleCopy}>
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>
            <div className="ostim-json-editor">
                <Editor
                    defaultLanguage="json"
                    path={OSTIM_MODEL_PATH}
                    theme="vs-dark"
                    beforeMount={handleBeforeMount}
                    onMount={handleEditorMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 16,
                        lineHeight: 22,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        tabSize: 2,
                        autoIndent: 'none',
                        automaticLayout: true,
                        fixedOverflowWidgets: true,
                        padding: { top: 12, bottom: 12 },
                    }}
                />
            </div>
        </div>
    )
}
