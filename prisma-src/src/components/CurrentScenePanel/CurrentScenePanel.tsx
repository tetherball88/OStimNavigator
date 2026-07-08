import { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { SceneRow } from '../../types'
import './CurrentScenePanel.css'

interface CurrentScenePanelProps {
    scene: SceneRow
    activeActions: Set<string>
    activeSceneTags: Set<string>
    activeActorTags: Set<string>
    onActionClick: (type: string) => void
    onSceneTagClick: (tag: string) => void
    onActorTagClick: (tag: string) => void
}

export function CurrentScenePanel({
    scene,
    activeActions,
    activeSceneTags,
    activeActorTags,
    onActionClick,
    onSceneTagClick,
    onActorTagClick,
}: CurrentScenePanelProps) {
    const [expanded, setExpanded] = useState(true)

    // Derive unique action types
    const uniqueActions = useMemo(() =>
        Array.from(new Set(scene.actions.map(a => a.type))).sort(),
        [scene.actions]
    )

    // Derive actor tags per slot
    const actorTagSlots = useMemo(() =>
        scene.actors.map(a => Array.from(new Set(a.tags)).sort()),
        [scene.actors]
    )

    return (
        <div className="csp-wrapper">
            <button
                className="csp-header"
                onClick={() => setExpanded(v => !v)}
                aria-expanded={expanded}
            >
                <span className="csp-header-title">Current Scene</span>
                <span className="csp-header-id">{scene.id}</span>
                <FontAwesomeIcon
                    icon={expanded ? faChevronDown : faChevronRight}
                    className="csp-header-caret"
                    aria-hidden="true"
                />
            </button>

            {expanded && (
                <div className="csp-body">
                    {/* Scene info row */}
                    <div className="csp-info-row">
                        <span className="csp-label">ID</span>
                        <span className="csp-value csp-value--id">{scene.id}</span>
                        {scene.name && scene.name !== scene.id && (
                            <>
                                <span className="csp-sep">·</span>
                                <span className="csp-value">{scene.name}</span>
                            </>
                        )}
                        <span className="csp-sep">·</span>
                        <span className="csp-value csp-value--modpack">{scene.modpack}</span>
                        {scene.furnitureType && (
                            <>
                                <span className="csp-sep">·</span>
                                <span className="csp-label">Furniture</span>
                                <span className="csp-value">{scene.furnitureType}</span>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    {uniqueActions.length > 0 && (
                        <div className="csp-row">
                            <span className="csp-label">Actions</span>
                            <div className="csp-pills">
                                {uniqueActions.map(type => (
                                    <button
                                        key={type}
                                        className={`csp-pill csp-pill--action${activeActions.has(type) ? ' csp-pill--active' : ''}`}
                                        onClick={() => onActionClick(type)}
                                        title={`Filter by action: ${type}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Scene Tags */}
                    {scene.tags.length > 0 && (
                        <div className="csp-row">
                            <span className="csp-label">Scene Tags</span>
                            <div className="csp-pills">
                                {scene.tags.map(tag => (
                                    <button
                                        key={tag}
                                        className={`csp-pill csp-pill--tag${activeSceneTags.has(tag) ? ' csp-pill--active' : ''}`}
                                        onClick={() => onSceneTagClick(tag)}
                                        title={`Filter by scene tag: ${tag}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actor Tags — per slot */}
                    {actorTagSlots.some(tags => tags.length > 0) && (
                        <div className="csp-row">
                            <span className="csp-label">Actor Tags</span>
                            <div className="csp-actor-slots">
                                {actorTagSlots.map((tags, i) =>
                                    tags.length > 0 ? (
                                        <div key={i} className="csp-actor-slot">
                                            <span className="csp-actor-slot-label">Actor {i + 1}</span>
                                            <div className="csp-pills">
                                                {tags.map(tag => (
                                                    <button
                                                        key={tag}
                                                        className={`csp-pill csp-pill--actor${activeActorTags.has(tag) ? ' csp-pill--active' : ''}`}
                                                        onClick={() => onActorTagClick(tag)}
                                                        title={`Filter by actor tag: ${tag}`}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
