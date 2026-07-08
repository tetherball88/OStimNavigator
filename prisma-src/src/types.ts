export interface ActorData {
    intendedSex: string   // "male", "female", or ""
    tags: string[]
}

export interface SceneActionData {
    type: string
    actor: number
    target: number
    performer: number
}

export interface SceneRow {
    id: string
    name: string
    modpack: string
    actorCount: number
    furnitureType: string
    tags: string[]
    actions: SceneActionData[]
    actors: ActorData[]
    isTransition: boolean
    noRandomSelection: boolean
    hasCustomDescription?: boolean
    descriptionInherited?: boolean
}
