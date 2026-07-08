import { useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faAnglesLeft,
    faAnglesRight,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faFilter,
    faMars,
    faPlay,
    faVenus,
    faMarsAndVenus,
} from '@fortawesome/free-solid-svg-icons'
import { useNavigatorStore } from '../../store/index'
import { SceneRow } from '../../types'
import { OStimPresetModal } from '../OStimPresetModal/OStimPresetModal'
import { CurrentScenePanel } from '../CurrentScenePanel/CurrentScenePanel'
import './SceneTable.css'
import { notifyTextFocus } from '../../services/gameIntegration'

// ─── Pill ─────────────────────────────────────────────────────────────────────

interface PillProps {
    label: string
    active?: boolean
    onClick?: () => void
}

function Pill({ label, active, onClick }: PillProps) {
    return (
        <span
            className={`pill${active ? ' pill--active' : ''}`}
            onClick={onClick}
            title={label}
        >
            {label}
        </span>
    )
}

// ─── helper: render a gender setup string (e.g. "fm") as coloured icons ──────

function GenderSetupLabel({ setup, showLabel = true }: { setup: string, showLabel?: boolean }) {
    if (!setup) return null
    return (
        <span className="gender-composition">
            {setup.split('').map((ch, i) => {
                if (ch === 'm') return <span key={i} className="gender-icon gender-male" title="Male"  ><FontAwesomeIcon icon={faMars} /></span>
                if (ch === 'f') return <span key={i} className="gender-icon gender-female" title="Female"><FontAwesomeIcon icon={faVenus} /></span>
                return <span key={i} className="gender-icon gender-any" title="Any"   ><FontAwesomeIcon icon={faMarsAndVenus} /></span>
            })}
            {showLabel && <span className="gender-setup-text">&nbsp;{setup}</span>}
        </span>
    )
}

// ─── helper: derive normalised gender setup string from actors ────────────────

function getGenderSetup(actors: { intendedSex: string }[]): string {
    const order: Record<string, number> = { f: 0, m: 1, '?': 2 }
    return actors
        .map(a => a.intendedSex === 'male' ? 'm' : a.intendedSex === 'female' ? 'f' : '?')
        .sort((a, b) => (order[a] ?? 99) - (order[b] ?? 99))
        .join('')
}

// Expand a gender setup that may contain '?' into all m/f combinations it can match.
// e.g. "f?" => ["ff", "fm"], "??" => ["ff", "fm", "mf", "mm"] (then sorted canonically)
function expandQuestionMarks(setup: string): string[] {
    const results: string[] = []
    function recurse(idx: number, current: string) {
        if (idx === setup.length) { results.push(current); return }
        const ch = setup[idx]
        if (ch === '?') {
            recurse(idx + 1, current + 'f')
            recurse(idx + 1, current + 'm')
        } else {
            recurse(idx + 1, current + ch)
        }
    }
    recurse(0, '')
    return results
}

// Sort gender setups: by length ascending, then lexically (f < m).
function sortGenderSetups(setups: string[]): string[] {
    return [...setups].sort((a, b) => a.length !== b.length ? a.length - b.length : a.localeCompare(b))
}

// Generate all canonical m/f setups for a given actor count.
// Since getGenderSetup always sorts f before m, we only need combinations
// (k f's followed by n-k m's), not permutations — fm and mf are the same setup.
function canonicalSetupsForCount(count: number): string[] {
    if (count === 0) return []
    const results: string[] = []
    for (let f = count; f >= 0; f--) {
        results.push('f'.repeat(f) + 'm'.repeat(count - f))
    }
    return results
}

// ─── MultiSelectFilter ────────────────────────────────────────────────────────

interface MultiSelectFilterProps {
    label: string
    options: string[]
    selected: Set<string>
    andMode?: boolean
    showAndOr?: boolean
    onToggle: (value: string) => void
    onAndOrToggle?: () => void
    searchable?: boolean
    renderOption?: (value: string) => React.ReactNode
}

function MultiSelectFilter({
    label,
    options,
    selected,
    andMode,
    showAndOr,
    onToggle,
    onAndOrToggle,
    searchable,
    renderOption,
}: MultiSelectFilterProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const ref = useRef<HTMLDivElement>(null)

    const filtered = useMemo(() => {
        const base = searchable && search
            ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
            : options
        return [...base].sort((a, b) => {
            const aSelected = selected.has(a) ? 0 : 1
            const bSelected = selected.has(b) ? 0 : 1
            return aSelected - bSelected
        })
    }, [options, search, searchable, selected])

    const hasActive = selected.size > 0

    function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
        if (!ref.current?.contains(e.relatedTarget as Node)) {
            setOpen(false)
            setSearch('')
        }
    }

    return (
        <div className="msf-wrapper" ref={ref} onBlur={handleBlur} tabIndex={-1}>
            <div className="msf-header">
                {showAndOr && (
                    <button
                        className={`msf-andor${andMode ? ' msf-andor--and' : ' msf-andor--or'}`}
                        onClick={onAndOrToggle}
                        title={andMode ? 'AND: scene must have ALL selected' : 'OR: scene must have ANY selected'}
                        type="button"
                    >
                        {andMode ? 'AND' : 'OR'}
                    </button>
                )}
                <button
                    className={`msf-toggle ${showAndOr ? 'msf-andor-toggle' : ''} prism-control-button${hasActive ? ' msf-toggle--active' : ''}`}
                    onClick={() => setOpen(v => !v)}
                    type="button"
                >
                    <span className="msf-label">{label}</span>
                    {hasActive && <span className="msf-count">{selected.size}</span>}
                    <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} className="msf-caret" aria-hidden="true" />
                </button>
            </div>
            {open && (
                <div className="msf-dropdown">
                    {searchable && (
                        <input
                            className="msf-search prism-control-input"
                            placeholder="Search…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={() => notifyTextFocus(true)}
                            onBlur={() => notifyTextFocus(false)}
                            autoFocus
                        />
                    )}
                    <div className="msf-options">
                        {filtered.map(opt => (
                            <label key={opt} className={`msf-option${selected.has(opt) ? ' msf-option--checked' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={selected.has(opt)}
                                    onChange={() => onToggle(opt)}
                                    className="msf-checkbox"
                                />
                                <span className="msf-option-label">
                                    {renderOption ? renderOption(opt) : opt}
                                </span>
                            </label>
                        ))}
                        {filtered.length === 0 && (
                            <span className="msf-empty">No matches</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── SceneTable ───────────────────────────────────────────────────────────────

const COLUMNS = ['ID', 'Modpack', 'Desc', 'Config'] as const

type DescFilter = 'all' | 'with' | 'without'

export function SceneTable() {
    const scenes = useNavigatorStore(state => state.scenes)
    const playerThreadRunning = useNavigatorStore(state => state.playerThreadRunning)
    const currentSceneId = useNavigatorStore(state => state.currentSceneId)
    const currentThread = useNavigatorStore(state => state.currentThread)
    const sceneSuggestions = useNavigatorStore(state => state.sceneSuggestions)

    // ── basic filter state ──
    const [search, setSearch] = useState('')
    const [modpackFilter, setModpackFilter] = useState<Set<string>>(new Set())
    const [descFilter, setDescFilter] = useState<DescFilter>('all')
    const [filtersExpanded, setFiltersExpanded] = useState(false)
    const [page, setPage] = useState(0)
    const PAGE_SIZE = 50

    // ── rich filter state ──
    const [sceneTagFilter, setSceneTagFilter] = useState<Set<string>>(new Set())
    const [sceneTagsAND, setSceneTagsAND] = useState(false)
    const [actorTagFilter, setActorTagFilter] = useState<Set<string>>(new Set())
    const [actorTagsAND, setActorTagsAND] = useState(false)
    const [actionsFilter, setActionsFilter] = useState<Set<string>>(new Set())
    const [actionTagsFilter, setActionTagsFilter] = useState<Set<string>>(new Set())
    const [actionTagsAND, setActionTagsAND] = useState(false)
    const [furnitureFilter, setFurnitureFilter] = useState<Set<string>>(new Set())
    const [hideTransitions, setHideTransitions] = useState(false)
    const [hideNonRandom, setHideNonRandom] = useState(false)
    const [genderFilter, setGenderFilter] = useState<Set<string>>(new Set())
    const [preselected, setPreselected] = useState(false)

    useEffect(() => {
        if (preselected || !currentThread || scenes.length === 0) return

        const setup = currentThread.genderSetup
        const furniture = currentThread.furniture

        const newGenderFilter = new Set<string>()
        if (setup) {
            // Expand '?' in the thread's gender setup so all matching canonical options are pre-selected.
            expandQuestionMarks(setup).forEach(s => newGenderFilter.add(s))
        }

        const newFurnitureFilter = new Set<string>()
        newFurnitureFilter.add(furniture || 'none')

        setGenderFilter(newGenderFilter)
        setFurnitureFilter(newFurnitureFilter)
        setPreselected(true)
    }, [scenes, currentThread, preselected])

    const [modalScene, setModalScene] = useState<SceneRow | null>(null)

    function openModal(scene: SceneRow) {
        setModalScene(scene)
    }

    // ── derived options ──
    const allModpacks = useMemo(() =>
        Array.from(new Set(scenes.map(s => s.modpack).filter(Boolean))).sort(),
        [scenes])

    const allFurnitureTypes = useMemo(() => {
        const types = Array.from(new Set(scenes.map(s => s.furnitureType).filter(Boolean))).sort()
        return ['none', ...types]
    }, [scenes])

    const allActionTagOptions = useMemo(() => {
        const tags = Object.values(sceneSuggestions.actionTagSuggestions).flat()
        return Array.from(new Set(tags)).sort()
    }, [sceneSuggestions.actionTagSuggestions])

    const allGenderSetups = useMemo(() => {
        // Collect unique actor counts from scenes (ignoring swapped scenes)
        const counts = new Set(scenes
            .filter(s => !s.id.toLowerCase().includes('swapped'))
            .map(s => s.actors.length)
            .filter(n => n > 0)
        )
        // Generate all canonical m/f setups for each count present
        const setups = new Set<string>()
        counts.forEach(n => canonicalSetupsForCount(n).forEach(s => setups.add(s)))
        return sortGenderSetups(Array.from(setups))
    }, [scenes])

    const hasAnyRichFilter =
        modpackFilter.size > 0 ||
        sceneTagFilter.size > 0 ||
        actorTagFilter.size > 0 ||
        actionsFilter.size > 0 ||
        actionTagsFilter.size > 0 ||
        furnitureFilter.size > 0 ||
        genderFilter.size > 0 ||
        hideTransitions ||
        hideNonRandom

    const hasAnyClearableFilter =
        !!search ||
        descFilter !== 'all' ||
        hasAnyRichFilter

    // ── filter + sort ──
    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return scenes.filter(s => {
            if (s.id.toLowerCase().includes('swapped')) return false
            if (q && !s.id.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false
            if (modpackFilter.size && !modpackFilter.has(s.modpack)) return false
            if (descFilter === 'with' && !s.hasCustomDescription) return false
            if (descFilter === 'without' && s.hasCustomDescription) return false
            // current scene pinned separately
            if (s.id.toLowerCase() === currentSceneId.toLowerCase()) return false

            // ── rich filters ──
            if (hideTransitions && s.isTransition) return false
            if (hideNonRandom && s.noRandomSelection) return false

            if (furnitureFilter.size) {
                const effectiveFurniture = s.furnitureType || 'none'
                if (!furnitureFilter.has(effectiveFurniture)) return false
            }

            if (genderFilter.size) {
                // Expand any '?' in the scene's setup into m/f combinations,
                // then check if any of those combinations match a selected filter option.
                const sceneSetup = getGenderSetup(s.actors)
                const expanded = expandQuestionMarks(sceneSetup)
                if (!expanded.some(e => genderFilter.has(e))) return false
            }

            if (sceneTagFilter.size) {
                const match = sceneTagsAND
                    ? [...sceneTagFilter].every(t => s.tags.includes(t))
                    : [...sceneTagFilter].some(t => s.tags.includes(t))
                if (!match) return false
            }

            if (actorTagFilter.size) {
                const match = s.actors.some(actor =>
                    actorTagsAND
                        ? [...actorTagFilter].every(t => actor.tags.includes(t))
                        : [...actorTagFilter].some(t => actor.tags.includes(t))
                )
                if (!match) return false
            }

            if (actionsFilter.size) {
                const sceneActionTypes = s.actions.map(a => a.type)
                const match = [...actionsFilter].some(t => sceneActionTypes.includes(t))
                if (!match) return false
            }

            if (actionTagsFilter.size) {
                const actionTagMap = sceneSuggestions.actionTagSuggestions
                const match = actionTagsAND
                    ? [...actionTagsFilter].every(tag =>
                        s.actions.some(a => (actionTagMap[a.type] ?? []).includes(tag))
                    )
                    : s.actions.some(a =>
                        (actionTagMap[a.type] ?? []).some(tag => actionTagsFilter.has(tag))
                    )
                if (!match) return false
            }

            return true
        })
    }, [
        scenes, search, modpackFilter, descFilter, currentSceneId,
        sceneTagFilter, sceneTagsAND, actorTagFilter, actorTagsAND,
        actionsFilter, actionTagsFilter, actionTagsAND,
        furnitureFilter, genderFilter, hideTransitions, hideNonRandom,
        sceneSuggestions.actionTagSuggestions,
    ])

    // The current scene is always pinned to the top of the table regardless of
    // pagination. Exclude it from the paginated list to avoid a duplicate row.
    const pinnedRow = useMemo(() => {
        return currentSceneId ? scenes.find(s => s.id.toLowerCase() === currentSceneId.toLowerCase()) ?? null : null
    }, [scenes, currentSceneId])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages - 1)
    const pageRows = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

    function toggleSet<T>(set: Set<T>, value: T): Set<T> {
        const next = new Set(set)
        if (next.has(value)) next.delete(value)
        else next.add(value)
        return next
    }

    function clearAllFilters() {
        setSearch('')
        setModpackFilter(new Set())
        setDescFilter('all')
        setSceneTagFilter(new Set())
        setActorTagFilter(new Set())
        setActionsFilter(new Set())
        setActionTagsFilter(new Set())
        setFurnitureFilter(new Set())
        setGenderFilter(new Set())
        setHideTransitions(false)
        setHideNonRandom(false)
        setPage(0)
        setPreselected(false)
    }

    // ── pill callbacks for CurrentScenePanel ──
    function handleActionPillClick(type: string) {
        setActionsFilter(s => toggleSet(s, type))
        setPage(0)
    }

    function handleSceneTagPillClick(tag: string) {
        setSceneTagFilter(s => toggleSet(s, tag))
        setPage(0)
    }

    function handleActorTagPillClick(tag: string) {
        setActorTagFilter(s => toggleSet(s, tag))
        setPage(0)
    }

    return (
        <div className="scene-table-wrapper">
            {/* ── current scene panel ── */}
            {pinnedRow && (
                <CurrentScenePanel
                    scene={pinnedRow}
                    activeActions={actionsFilter}
                    activeSceneTags={sceneTagFilter}
                    activeActorTags={actorTagFilter}
                    onActionClick={handleActionPillClick}
                    onSceneTagClick={handleSceneTagPillClick}
                    onActorTagClick={handleActorTagPillClick}
                />
            )}

            {/* ── toolbar ── */}
            <div className="scene-table-toolbar">
                <input
                    className="scene-table-search prism-control-input"
                    type="text"
                    placeholder="Search by ID or name…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(0) }}
                    onFocus={() => notifyTextFocus(true)}
                    onBlur={() => notifyTextFocus(false)}
                />

                <button
                    className={`scene-table-filter-toggle prism-control-button${(filtersExpanded || hasAnyRichFilter) ? ' scene-table-filter-toggle--active' : ''}`}
                    onClick={() => setFiltersExpanded(v => !v)}
                    aria-expanded={filtersExpanded}
                    aria-controls="scene-table-filters"
                    type="button"
                >
                    <FontAwesomeIcon icon={faFilter} className="scene-table-filter-icon" aria-hidden="true" />
                    <span className="scene-table-filter-label">Filter</span>
                    <FontAwesomeIcon
                        icon={filtersExpanded ? faChevronDown : faChevronRight}
                        className="scene-table-filter-caret"
                        aria-hidden="true"
                    />
                </button>

                {hasAnyClearableFilter && (
                    <button
                        className="scene-table-clear prism-control-button"
                        onClick={clearAllFilters}
                    >
                        Clear filters
                    </button>
                )}

                <span className="scene-table-count prism-count-text">{filtered.length} scenes</span>
            </div>

            {filtersExpanded && (
                <div id="scene-table-filters" className="scene-table-filters">
                    <div className="scene-table-filter-row scene-table-filter-row--compat">
                        <label className="compat-check">
                            <input
                                type="checkbox"
                                checked={hideTransitions}
                                onChange={e => { setHideTransitions(e.target.checked); setPage(0) }}
                            />
                            <span>Hide Transitions</span>
                        </label>
                        <label className="compat-check">
                            <input
                                type="checkbox"
                                checked={hideNonRandom}
                                onChange={e => { setHideNonRandom(e.target.checked); setPage(0) }}
                            />
                            <span>Hide Non-Random Selection</span>
                        </label>
                    </div>
                    <div className="scene-table-filter-row">
                        <div className="scene-table-filter-col">

                            <MultiSelectFilter
                                label="Modpack"
                                options={allModpacks}
                                selected={modpackFilter}
                                onToggle={v => { setModpackFilter(s => toggleSet(s, v)); setPage(0) }}
                                searchable
                            />

                            {allGenderSetups.length > 0 && (
                                <MultiSelectFilter
                                    label="Actor Setup"
                                    options={allGenderSetups}
                                    selected={genderFilter}
                                    onToggle={v => { setGenderFilter(s => toggleSet(s, v)); setPage(0) }}
                                    renderOption={v => <GenderSetupLabel setup={v} />}
                                />
                            )}

                            {allFurnitureTypes.length > 0 && (
                                <MultiSelectFilter
                                    label="Furniture"
                                    options={allFurnitureTypes}
                                    selected={furnitureFilter}
                                    onToggle={v => { setFurnitureFilter(s => toggleSet(s, v)); setPage(0) }}
                                />
                            )}
                            <MultiSelectFilter
                                label="Actions"
                                options={sceneSuggestions.actionTypes}
                                selected={actionsFilter}
                                onToggle={v => { setActionsFilter(s => toggleSet(s, v)); setPage(0) }}
                                searchable
                                showAndOr
                            />
                        </div>

                        <div className="scene-table-filter-col">
                            <div className="desc-toggle" role="group" aria-label="Custom description filter">
                                <span className="desc-toggle-label">Desc</span>
                                {(['all', 'with', 'without'] as const).map(opt => (
                                    <button
                                        key={opt}
                                        type="button"
                                        className={`desc-toggle-btn${descFilter === opt ? ' desc-toggle-btn--active' : ''}`}
                                        onClick={() => { setDescFilter(opt); setPage(0) }}
                                    >
                                        {opt === 'all' ? 'All' : opt === 'with' ? 'With' : 'Without'}
                                    </button>
                                ))}
                            </div>
                            <MultiSelectFilter
                                label="Scene Tags"
                                options={sceneSuggestions.sceneTags}
                                selected={sceneTagFilter}
                                andMode={sceneTagsAND}
                                showAndOr
                                onToggle={v => { setSceneTagFilter(s => toggleSet(s, v)); setPage(0) }}
                                onAndOrToggle={() => setSceneTagsAND(v => !v)}
                                searchable
                            />
                            <MultiSelectFilter
                                label="Actor Tags"
                                options={sceneSuggestions.actorTags}
                                selected={actorTagFilter}
                                andMode={actorTagsAND}
                                showAndOr
                                onToggle={v => { setActorTagFilter(s => toggleSet(s, v)); setPage(0) }}
                                onAndOrToggle={() => setActorTagsAND(v => !v)}
                                searchable
                            />
                            {allActionTagOptions.length > 0 && (
                                <MultiSelectFilter
                                    label="Action Tags"
                                    options={allActionTagOptions}
                                    selected={actionTagsFilter}
                                    andMode={actionTagsAND}
                                    showAndOr
                                    onToggle={v => { setActionTagsFilter(s => toggleSet(s, v)); setPage(0) }}
                                    onAndOrToggle={() => setActionTagsAND(v => !v)}
                                    searchable
                                />
                            )}
                        </div>
                    </div>

                    <div className="scene-table-filter-row">



                    </div>

                </div>
            )}

            {/* ── table ── */}
            <div className="scene-table-scroll">
                <table className="scene-table">
                    <thead>
                        <tr>
                            {playerThreadRunning && (
                                <th className="col-warp" title="Warp player thread to this scene" />
                            )}
                            {COLUMNS.map(col => (
                                <th
                                    key={col}
                                    className={`col-${col.replace(' ', '-').toLowerCase()}`}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pinnedRow && (
                            <tr key={pinnedRow.id} className={[
                                'row--current',
                                'row--pinned',
                                pinnedRow.isTransition ? 'row-transition' : '',
                            ].filter(Boolean).join(' ')}>
                                {playerThreadRunning && (
                                    <td className="col-warp">
                                        <div className="active-marker" />
                                        <button
                                            className="row-action-btn row-action-btn--warp"
                                            title={`Warp to ${pinnedRow.id}`}
                                            onClick={() => window.warpToScene?.(pinnedRow.id)}
                                        >
                                            <FontAwesomeIcon icon={faPlay} aria-hidden="true" />
                                        </button>
                                    </td>
                                )}
                                <td className="col-id" title={pinnedRow.id}>
                                    {pinnedRow.id}<br />
                                    <span className="col-id-name">{pinnedRow.name}</span>
                                    <GenderSetupLabel setup={getGenderSetup(pinnedRow.actors)} showLabel={false} />
                                </td>
                                <td className="col-modpack" title={pinnedRow.modpack}>
                                    <Pill
                                        label={pinnedRow.modpack}
                                        active={modpackFilter.has(pinnedRow.modpack)}
                                        onClick={() => { setModpackFilter(s => toggleSet(s, pinnedRow.modpack)); setPage(0) }}
                                    />
                                </td>
                                <td className="col-desc" title={
                                    pinnedRow.descriptionInherited
                                        ? 'Has inherited description'
                                        : pinnedRow.hasCustomDescription
                                            ? 'Has custom description'
                                            : 'No custom description'
                                }>
                                    {pinnedRow.descriptionInherited ? '↷' : pinnedRow.hasCustomDescription ? '✓' : ''}
                                </td>
                                <td className="col-presets">
                                    <div className="preset-btn-group">
                                        <button
                                            className="row-action-btn row-action-btn--ostim"
                                            onClick={() => openModal(pinnedRow)}
                                            title="Open Config Modal"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {pageRows.map(scene => (
                            <tr key={scene.id} className={[
                                scene.isTransition ? 'row-transition' : '',
                            ].filter(Boolean).join(' ')}>
                                {/* Warp */}
                                {playerThreadRunning && (
                                    <td className="col-warp">
                                        <button
                                            className="row-action-btn row-action-btn--warp"
                                            title={`Warp to ${scene.id}`}
                                            onClick={() => window.warpToScene?.(scene.id)}
                                        >
                                            <FontAwesomeIcon icon={faPlay} aria-hidden="true" />
                                        </button>
                                    </td>
                                )}
                                {/* ID */}
                                <td className="col-id" title={scene.id}>
                                    {scene.id}<br />
                                    <span className="col-id-name">{scene.name}</span>
                                    <GenderSetupLabel setup={getGenderSetup(scene.actors)} showLabel={false} />
                                </td>

                                {/* Modpack */}
                                <td className="col-modpack" title={scene.modpack}>
                                    <Pill
                                        label={scene.modpack}
                                        active={modpackFilter.has(scene.modpack)}
                                        onClick={() => { setModpackFilter(s => toggleSet(s, scene.modpack)); setPage(0) }}
                                    />
                                </td>

                                {/* Desc */}
                                <td className="col-desc" title={
                                    scene.descriptionInherited
                                        ? 'Has inherited description'
                                        : scene.hasCustomDescription
                                            ? 'Has custom description'
                                            : 'No custom description'
                                }>
                                    {scene.descriptionInherited ? '↷' : scene.hasCustomDescription ? '✓' : ''}
                                </td>

                                {/* Presets */}
                                <td className="col-presets">
                                    <div className="preset-btn-group">
                                        <button
                                            className="row-action-btn row-action-btn--ostim"
                                            onClick={() => openModal(scene)}
                                            title="Open Config Modal"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pageRows.length === 0 && (
                            <tr>
                                <td colSpan={COLUMNS.length + (playerThreadRunning ? 1 : 0)} className="empty-row">No scenes match the current filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── modal ── */}
            {modalScene && (
                <OStimPresetModal
                    scene={modalScene}
                    onClose={() => setModalScene(null)}
                />
            )}

            {/* ── pagination ── */}
            {totalPages > 1 && (
                <div className="scene-table-pagination">
                    <button disabled={currentPage === 0} onClick={() => setPage(0)}>
                        <FontAwesomeIcon icon={faAnglesLeft} aria-hidden="true" />
                    </button>
                    <button disabled={currentPage === 0} onClick={() => setPage(p => p - 1)}>
                        <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
                    </button>
                    <span>{currentPage + 1} / {totalPages}</span>
                    <button disabled={currentPage >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                        <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
                    </button>
                    <button disabled={currentPage >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>
                        <FontAwesomeIcon icon={faAnglesRight} aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    )
}
