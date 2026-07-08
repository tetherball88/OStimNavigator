import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { StoreState } from './types'

const DEFAULT_ACTION_TYPES = [
    'analfingering','analfisting','analsex','analtoying','anilingus','bathing',
    'blowjob','boobjob','breastsmothering','buttjob','buttsmothering','cuddling',
    'cumonbutt','cumonchest','cumonvulva','cunnilingus','dancing','deepthroat',
    'facial','femalemasturbation','footjob','frenchkissing','grindingfoot',
    'grindingobject','grindingpenis','grindingthigh','gropingbreast','gropingbutt',
    'gropingtesticles','handjob','holdingarm','holdingbody','holdingchin',
    'holdingfoot','holdinghand','holdinghead','holdinghip','holdingleg','holdingneck',
    'holdingthigh','hugging','kissing','kissingcheek','kissingfoot','kissinghand',
    'kissingneck','leglocking','lickingnipple','lickingpenis','lickingtesticles',
    'lickingvagina','malemasturbation','mounting','oralfingering','pattinghead',
    'pullinghair','rimjob','rubbingclitoris','rubbingpenisagainstface','spectating',
    'spooning','strokinghead','suckingnipple','thighjob','ticklingfoot','tribbing',
    'vaginalfingering','vaginalfisting','vaginalsex','vaginaltoying','vampirebite',
]

const DEFAULT_ACTOR_TAGS = [
    'allfours','bendover','drowsy','facingaway','handstanding','kneeling',
    'lyingback','lyingfront','lyingside','onbottom','ontop','sitting','sleeping',
    'spreadlegs','squatting','standing','suspended','upsidedown',
]

const DEFAULT_SCENE_TAGS = [
    'cowgirl','doggystyle','facesitting','gay','idle','lesbian','missionary',
    'prone','reversecowgirl','sixtynine','spitroast','transition',
]

export const useNavigatorStore = create<StoreState>()(
    devtools((set) => ({
        visible: false,
        setVisible: (visible) => set({ visible }),

        scenes: [],
        setScenes: (scenes) => set({ scenes }),
        setSceneHasCustomDescription: (sceneId, hasDescription) => set(state => ({
            scenes: state.scenes.map(s =>
                s.id.toLowerCase() === sceneId.toLowerCase()
                    ? { ...s, hasCustomDescription: hasDescription }
                    : s
            ),
        })),

        currentThread: null,
        setCurrentThread: (currentThread) => set({ currentThread }),

        playerThreadRunning: true,
        setPlayerThreadRunning: (playerThreadRunning) => set({ playerThreadRunning }),

        currentSceneId: '',
        setCurrentSceneId: (currentSceneId) => set({ currentSceneId }),

        sceneSuggestions: {
            actionTypes: DEFAULT_ACTION_TYPES,
            actorTags: DEFAULT_ACTOR_TAGS,
            sceneTags: DEFAULT_SCENE_TAGS,
            actionTagSuggestions: {},
        },
        setSceneSuggestions: (sceneSuggestions) => set({ sceneSuggestions }),

        ostimNetSuggestions: {
            intents: ['platonic', 'romantic', 'transactional', 'dom', 'aggressive'],
            positions: ['cowgirl', 'reversecowgirl', 'missionary', 'doggy'],
        },
        setOStimNetSuggestions: (ostimNetSuggestions) => set({ ostimNetSuggestions }),
    }))
)

export type { StoreState }
