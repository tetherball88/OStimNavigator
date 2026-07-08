import { StoreState, SceneSuggestions, OStimNetSuggestions } from '../store/types'
import { SceneRow } from '../types'

declare global {
    interface Window {
        showNavigator?: () => void
        hideNavigator?: () => void
        updateScenes?: (data: string | SceneRow[]) => void
        updateSceneSuggestions?: (data: string | SceneSuggestions) => void
        updateOStimNetSuggestions?: (data: string | OStimNetSuggestions) => void
        saveSceneJson?: (data: string) => void
        receiveSaveSceneJson?: (success: boolean) => void
        requestSceneJson?: (sceneId: string) => void
        receiveSceneJson?: (json: string) => void
        requestAutoDescription?: (sceneId: string) => void
        receiveAutoDescription?: (description: string) => void
        requestCustomDescription?: (sceneId: string) => void
        receiveCustomDescription?: (description: string) => void
        saveCustomDescription?: (argument: string) => void
        receiveCustomDescriptionSaved?: (success: boolean) => void
        requestSceneMeta?: (sceneId: string) => void
        receiveSceneMeta?: (data: string) => void
        saveSceneMeta?: (argument: string) => void
        receiveSceneMetaSaved?: (success: boolean) => void
        generateDescription?: (sceneId: string) => void
        receiveGeneratedDescription?: (description: string) => void
        receiveGeneratedDescriptionResult?: (result: { ok: boolean; text?: string; error?: string }) => void
        closeNavigator?: () => void
        warpToScene?: (sceneId: string) => void
        updatePlayerThreadRunning?: (running: boolean) => void
        updateCurrentScene?: (sceneId: string) => void
        updateCurrentThread?: (data: string) => void
        refocusView?: (unused?: string) => void
        log?: (message: string) => void
        setTextInputFocus?: (focused: string) => void
    }
}

export function notifyTextFocus(focused: boolean) {
    window.setTextInputFocus?.(focused ? 'true' : 'false')
}

// Pending resolver for the in-flight requestSceneJson call.
// Only one request can be in-flight at a time (user can only open one modal).
let _pendingSceneJsonResolve: ((json: string) => void) | null = null

export function requestSceneJsonAsync(sceneId: string): Promise<string> {
    return new Promise((resolve) => {
        _pendingSceneJsonResolve = resolve
        window.requestSceneJson?.(sceneId)
    })
}

// Pending resolver for the in-flight requestAutoDescription call.
let _pendingAutoDescriptionResolve: ((description: string) => void) | null = null

export function requestAutoDescriptionAsync(sceneId: string): Promise<string> {
    return new Promise((resolve) => {
        _pendingAutoDescriptionResolve = resolve
        window.requestAutoDescription?.(sceneId)
    })
}

// Pending resolver for the in-flight requestCustomDescription call.
let _pendingCustomDescriptionResolve: ((description: string) => void) | null = null

export function requestCustomDescriptionAsync(sceneId: string): Promise<string> {
    return new Promise((resolve) => {
        _pendingCustomDescriptionResolve = resolve
        window.requestCustomDescription?.(sceneId)
    })
}

export function saveCustomDescription(sceneId: string, description: string): void {
    window.saveCustomDescription?.(JSON.stringify({ sceneId, description }))
}

// ─── scene meta ───────────────────────────────────────────────────────────────

export interface SceneMeta {
    intent: string
    positions: string[]
}

let _pendingSceneMetaResolve: ((meta: SceneMeta) => void) | null = null

export function requestSceneMetaAsync(sceneId: string): Promise<SceneMeta> {
    return new Promise((resolve) => {
        _pendingSceneMetaResolve = resolve
        window.requestSceneMeta?.(sceneId)
    })
}

// Pending resolver for the in-flight saveSceneMeta call.
let _pendingSaveSceneMetaResolve: ((success: boolean) => void) | null = null

export function saveSceneMetaAsync(sceneId: string, meta: SceneMeta): Promise<boolean> {
    return new Promise((resolve) => {
        _pendingSaveSceneMetaResolve = resolve
        window.saveSceneMeta?.(JSON.stringify({ sceneId, ...meta }))
    })
}

// Pending resolver for the in-flight saveSceneJson call.
let _pendingSaveSceneJsonResolve: ((success: boolean) => void) | null = null

export function saveSceneJsonAsync(id: string, content: string): Promise<boolean> {
    return new Promise((resolve) => {
        _pendingSaveSceneJsonResolve = resolve
        window.saveSceneJson?.(JSON.stringify({ id, content }))
    })
}

// Pending resolver for the in-flight saveCustomDescription call.
let _pendingSaveCustomDescriptionResolve: ((success: boolean) => void) | null = null

export function saveCustomDescriptionAsync(sceneId: string, description: string): Promise<boolean> {
    return new Promise((resolve) => {
        _pendingSaveCustomDescriptionResolve = resolve
        window.saveCustomDescription?.(JSON.stringify({ sceneId, description }))
    })
}

// Pending resolver for the in-flight generateDescription call.
export type GenerateDescriptionResult = { ok: true; text: string } | { ok: false; error: string }
let _pendingGeneratedDescriptionResolve: ((result: GenerateDescriptionResult) => void) | null = null

export function generateDescriptionAsync(sceneId: string, additionalInstructions: string): Promise<GenerateDescriptionResult> {
    return new Promise((resolve) => {
        _pendingGeneratedDescriptionResolve = resolve
        window.generateDescription?.(JSON.stringify({ sceneId, additionalInstructions }))
    })
}

export function setupGameIntegration(store: StoreState) {
    window.showNavigator = () => {
        store.setVisible(true)
    }

    window.hideNavigator = () => {
        store.setVisible(false)
    }

    window.updateScenes = (data: string | SceneRow[]) => {
        const scenes = typeof data === 'string' ? JSON.parse(data) : data
        store.setScenes(scenes)
    }

    window.updateSceneSuggestions = (data: string | SceneSuggestions) => {
        const suggestions = typeof data === 'string' ? JSON.parse(data) : data
        store.setSceneSuggestions(suggestions)
    }

    window.updateOStimNetSuggestions = (data: string | OStimNetSuggestions) => {
        const suggestions = typeof data === 'string' ? JSON.parse(data) : data
        store.setOStimNetSuggestions(suggestions)
    }

    window.receiveSceneJson = (json: string) => {
        _pendingSceneJsonResolve?.(json)
        _pendingSceneJsonResolve = null
    }

    window.receiveAutoDescription = (description: string) => {
        _pendingAutoDescriptionResolve?.(description)
        _pendingAutoDescriptionResolve = null
    }

    window.receiveCustomDescription = (description: string) => {
        _pendingCustomDescriptionResolve?.(description)
        _pendingCustomDescriptionResolve = null
    }

    window.receiveCustomDescriptionSaved = (success: boolean) => {
        _pendingSaveCustomDescriptionResolve?.(success)
        _pendingSaveCustomDescriptionResolve = null
    }

    window.receiveGeneratedDescriptionResult = (result) => {
        if (_pendingGeneratedDescriptionResolve) {
            _pendingGeneratedDescriptionResolve(
                result.ok ? { ok: true, text: result.text ?? '' } : { ok: false, error: result.error ?? 'Unknown error.' }
            )
            _pendingGeneratedDescriptionResolve = null
        }
    }

    window.receiveSceneMeta = (data: string) => {
        const meta: SceneMeta = typeof data === 'string' ? JSON.parse(data) : data
        _pendingSceneMetaResolve?.(meta)
        _pendingSceneMetaResolve = null
    }

    window.receiveSceneMetaSaved = (success: boolean) => {
        _pendingSaveSceneMetaResolve?.(success)
        _pendingSaveSceneMetaResolve = null
    }

    window.receiveSaveSceneJson = (success: boolean) => {
        _pendingSaveSceneJsonResolve?.(success)
        _pendingSaveSceneJsonResolve = null
    }

    window.updatePlayerThreadRunning = (running: boolean) => {
        store.setPlayerThreadRunning(running)
    }

    window.updateCurrentScene = (sceneId: string) => {
        store.setCurrentSceneId(sceneId)
    }

    window.updateCurrentThread = (data: string) => {
        try {
            const threadData = typeof data === 'string' ? JSON.parse(data) : data
            store.setCurrentThread(threadData)
        } catch (e) {
            store.setCurrentThread(null)
        }
    }

    // Re-acquire focus when the user clicks inside the view after it lost focus
    // (e.g. from an Escape press or another UI element stealing focus).
    // Guard with document.hasFocus() — calling refocusView on every mousedown
    // schedules an unnecessary game-thread task and can cause microstutters on hover.
    document.addEventListener('mousedown', () => {
        if (!document.hasFocus()) {
            window.refocusView?.()
        }
    })
}

export function closeNavigatorView() {
    if (import.meta.env.DEV) {
        // In dev mode just hide via the store — no SKSE available.
        window.hideNavigator?.()
        return
    }
    window.closeNavigator?.()
}
