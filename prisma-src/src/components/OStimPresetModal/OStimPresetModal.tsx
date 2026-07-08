import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { SceneRow } from '../../types'
import { OStimJson } from './OStimJson/OStimJson'
import { OStimNetMetaTags } from './OStimNetMetaTags/OStimNetMetaTags'
import './OStimPresetModal.css'
import { useNavigatorStore } from '../../store'

// ─── component ───────────────────────────────────────────────────────────────

interface OStimPresetModalProps {
    scene: SceneRow
    onClose: () => void
}

export function OStimPresetModal({ scene, onClose }: OStimPresetModalProps) {
    const [activeTab, setActiveTab] = useState<'ostim' | 'ostimnet'>('ostim')
    const [dockedLeft, setDockedLeft] = useState(false)
    const currentSceneId = useNavigatorStore(state => state.currentSceneId)
    const isCurrentScene = useRef(scene.id.toLowerCase() === currentSceneId.toLowerCase())

    // if modal was opened for current scene, if we navigate to other scenes update the sceneId to load correct meta
    const finalSceneId = isCurrentScene.current ? currentSceneId : scene.id

    const titleColor = 'var(--amber)'

    // Close on Escape
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    return createPortal(
        <div className={`preset-modal-backdrop${dockedLeft ? ' preset-modal-backdrop--left' : ''}`} onClick={onClose}>
            <div className="preset-modal" onClick={e => e.stopPropagation()}>
                {/* header */}
                <div className="preset-modal-header">
                    <div className="preset-modal-title" style={{ color: titleColor }}>
                        <span className="preset-modal-scene-id">{finalSceneId}</span>
                    </div>
                    <div className="preset-modal-header-actions">
                        <button
                            className="preset-btn preset-btn--dock"
                            onClick={() => setDockedLeft(v => !v)}
                            title={dockedLeft ? 'Move to right side' : 'Move to left side'}
                        >
                            <FontAwesomeIcon icon={dockedLeft ? faAngleRight : faAngleLeft} />
                        </button>
                        <button className="preset-btn preset-btn--close" onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                </div>

                {/* tabs */}
                <div className="preset-modal-tabs">
                    <button
                        className={`preset-tab${activeTab === 'ostim' ? ' preset-tab--active' : ''}`}
                        onClick={() => setActiveTab('ostim')}
                    >
                        OStim
                    </button>
                    <button
                        className={`preset-tab${activeTab === 'ostimnet' ? ' preset-tab--active' : ''}`}
                        onClick={() => setActiveTab('ostimnet')}
                    >
                        OStimNet
                    </button>
                </div>

                {/* tab content */}
                {activeTab === 'ostim' && <OStimJson sceneId={finalSceneId} />}
                {activeTab === 'ostimnet' && <OStimNetMetaTags sceneId={finalSceneId} />}
            </div>
        </div>,
        document.body
    )
}
