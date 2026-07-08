import { useEffect, useRef, useState } from 'react'
import { useNavigatorStore } from '../../../store/index'
import { requestSceneMetaAsync, saveSceneMetaAsync, notifyTextFocus } from '../../../services/gameIntegration'

import { DescriptionModal } from './DescriptionModal/DescriptionModal'
import './DescriptionModal/DescriptionModal.css'
import './OStimNetMetaTags.css'

const DEV = import.meta.env.DEV

// ── shared suggestions dropdown ────────────────────────────────────────────

interface SuggestionsDropdownProps {
    items: string[]
    onSelect: (value: string) => void
    activeValue?: string
    placeholder?: { label: string; onSelect: () => void }
}

function SuggestionsDropdown({ items, onSelect, activeValue, placeholder }: SuggestionsDropdownProps) {
    if (!placeholder && items.length === 0) return null
    return (
        <ul className="ostimnet-suggestions">
            {placeholder && (
                <li
                    className="ostimnet-suggestion-item ostimnet-suggestion-item--placeholder"
                    onMouseDown={e => { e.preventDefault(); placeholder.onSelect() }}
                >
                    {placeholder.label}
                </li>
            )}
            {items.map(item => (
                <li
                    key={item}
                    className={`ostimnet-suggestion-item${item === activeValue ? ' ostimnet-suggestion-item--active' : ''}`}
                    onMouseDown={e => { e.preventDefault(); onSelect(item) }}
                >
                    {item}
                </li>
            ))}
        </ul>
    )
}

// ── reusable single-select dropdown ────────────────────────────────────────

interface CustomSelectProps {
    value: string
    options: string[]
    placeholder?: string
    onChange: (value: string) => void
}

function CustomSelect({ value, options, placeholder = '— select —', onChange }: CustomSelectProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    return (
        <div
            className="ostimnet-custom-select"
            ref={ref}
            tabIndex={0}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={e => { if (e.key === 'Escape') setOpen(false) }}
        >
            <span className={`ostimnet-custom-select-value${!value ? ' ostimnet-custom-select-placeholder' : ''}`}>
                {value || placeholder}
            </span>
            <span className="ostimnet-custom-select-arrow">▾</span>
            {open && (
                <SuggestionsDropdown
                    items={options}
                    onSelect={v => { onChange(v); setOpen(false) }}
                    activeValue={value}
                    placeholder={{ label: placeholder, onSelect: () => { onChange(''); setOpen(false) } }}
                />
            )}
        </div>
    )
}

interface OStimNetMetaTagsProps {
    sceneId: string
}

export function OStimNetMetaTags({ sceneId }: OStimNetMetaTagsProps) {
    const { intents, positions } = useNavigatorStore(state => state.ostimNetSuggestions)

    const [intent, setIntent] = useState('')
    const [selectedPositions, setSelectedPositions] = useState<string[]>([])
    const [positionInput, setPositionInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'saved' | 'failed' | null>(null)
    const [saving, setSaving] = useState(false)
    const positionInputRef = useRef<HTMLInputElement>(null)
    const multiselectRef = useRef<HTMLDivElement>(null)

    // Load meta whenever the scene changes
    useEffect(() => {
        if (DEV) return
        async function loadMeta() {
            const meta = await requestSceneMetaAsync(sceneId)
            setIntent(meta.intent)
            setSelectedPositions(meta.positions)
        }
        setIntent('')
        setSelectedPositions([])
        loadMeta()
    }, [sceneId])

    function addPosition(value: string) {
        const trimmed = value.trim()
        if (trimmed && !selectedPositions.includes(trimmed)) {
            setSelectedPositions(prev => [...prev, trimmed])
        }
        setPositionInput('')
    }

    function removePosition(pos: string) {
        setSelectedPositions(prev => prev.filter(p => p !== pos))
    }

    async function handleSave() {
        setSaving(true)
        setSaveStatus(null)
        const ok = DEV ? true : await saveSceneMetaAsync(sceneId, { intent, positions: selectedPositions })
        setSaving(false)
        setSaveStatus(ok ? 'saved' : 'failed')
        setTimeout(() => setSaveStatus(null), 3000)
    }

    return (
        <div className="ostimnet-metatags">
            <div className="ostimnet-field">
                <label className="ostimnet-label">Intent</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flexGrow: 1, marginRight: "10px" }}>
                        <CustomSelect
                            value={intent?.startsWith('dom') ? 'dom' : intent}
                            options={intents}
                            placeholder="— select —"
                            onChange={(val) => {
                                if (val === 'dom') {
                                    setIntent('dom')
                                } else {
                                    setIntent(val)
                                }
                            }}
                        />
                    </div>
                    {intent?.startsWith('dom') && (
                        <label className="ostimnet-checkbox-container">
                            <input
                                type="checkbox"
                                checked={intent.includes('femdom')}
                                onChange={(e) => {
                                    setIntent(e.target.checked ? 'dom,femdom' : 'dom')
                                }}
                                className="ostimnet-checkbox"
                            />
                            <span className="ostimnet-checkbox-label">Femdom</span>
                        </label>
                    )}
                </div>
            </div>

            <div className="ostimnet-field">
                <label className="ostimnet-label">Positions</label>
                <div
                    className="ostimnet-multiselect"
                    ref={multiselectRef}
                    onMouseDown={e => {
                        // Keep focus on input when clicking inside the container
                        if (e.target !== positionInputRef.current) e.preventDefault()
                    }}
                    onClick={() => positionInputRef.current?.focus()}
                >
                    {selectedPositions.map(p => (
                        <span key={p} className="ostimnet-chip">
                            {p}
                            <button className="ostimnet-chip-remove" onMouseDown={e => { e.preventDefault(); removePosition(p) }}>✕</button>
                        </span>
                    ))}
                    <input
                        ref={positionInputRef}
                        className="ostimnet-chip-input"
                        value={positionInput}
                        onChange={e => setPositionInput(e.target.value)}
                        onFocus={() => { setShowSuggestions(true); notifyTextFocus(true) }}
                        onBlur={() => { setShowSuggestions(false); notifyTextFocus(false); if (positionInput.trim()) addPosition(positionInput) }}
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault()
                                addPosition(positionInput)
                            } else if (e.key === 'Backspace' && positionInput === '' && selectedPositions.length > 0) {
                                removePosition(selectedPositions[selectedPositions.length - 1])
                            } else if (e.key === 'Escape') {
                                setShowSuggestions(false)
                            }
                        }}
                        placeholder={selectedPositions.length === 0 ? 'type or pick suggestion…' : ''}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    {showSuggestions && (
                        <SuggestionsDropdown
                            items={positions.filter(p =>
                                !selectedPositions.includes(p) &&
                                p.includes(positionInput.toLowerCase())
                            )}
                            onSelect={addPosition}
                        />
                    )}
                </div>
            </div>

            <div className="ostimnet-save-row">
                <button
                    className={`desc-generate-btn${saving ? ' desc-generate-btn--loading' : ''}`}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving…' : '💾 Save Meta'}
                </button>
                {saveStatus === 'saved' && <span className="desc-save-status desc-save-status--ok">✓ Saved</span>}
                {saveStatus === 'failed' && <span className="desc-save-status desc-save-status--err">✗ Failed</span>}
            </div>

            <div className="ostimnet-field ostimnet-field--description">
                <label className="ostimnet-label">Description</label>
                <DescriptionModal
                    sceneId={sceneId}
                />
            </div>
        </div >
    )
}
