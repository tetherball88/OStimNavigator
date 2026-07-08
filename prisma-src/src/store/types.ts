import { SceneRow } from '../types'

export interface SceneSuggestions {
    actionTypes: string[]
    actorTags: string[]
    sceneTags: string[]
    actionTagSuggestions: Record<string, string[]>
}

export interface OStimNetSuggestions {
    intents: string[]
    positions: string[]
}

export interface CurrentThreadData {
    genderSetup: string
    furniture: string
}

export interface StoreState {
    visible: boolean
    setVisible: (visible: boolean) => void

    scenes: SceneRow[]
    setScenes: (scenes: SceneRow[]) => void
    setSceneHasCustomDescription: (sceneId: string, hasDescription: boolean) => void

    currentThread: CurrentThreadData | null
    setCurrentThread: (thread: CurrentThreadData | null) => void

    playerThreadRunning: boolean
    setPlayerThreadRunning: (running: boolean) => void

    currentSceneId: string
    setCurrentSceneId: (id: string) => void

    sceneSuggestions: SceneSuggestions
    setSceneSuggestions: (suggestions: SceneSuggestions) => void

    ostimNetSuggestions: OStimNetSuggestions
    setOStimNetSuggestions: (suggestions: OStimNetSuggestions) => void
}
