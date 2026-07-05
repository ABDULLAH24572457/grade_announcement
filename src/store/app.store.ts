import { create } from 'zustand'

import { APP_DATA_SCHEMA_VERSION } from '@/constants/app.constants'
import {
  createDefaultCompetitionData,
  createDefaultStageData,
} from '@/constants/default-competition-data'
import { appDataService } from '@/services/storage/app-data.service'
import type {
  AppData,
  HydrationStatus,
  PersistedAppData,
} from '@/types/app.types'
import type {
  CompetitionData,
  Family,
  StageKey,
} from '@/types/competition.types'
import { parseScoreValue } from '@/utils/score-validation'

const createInitialData = (): AppData => ({
  selectedStage: null,
  competitionData: createDefaultCompetitionData(),
})

export interface AppStore extends AppData {
  hydrationStatus: HydrationStatus
  initialize: () => Promise<void>
  selectStage: (stageKey: StageKey) => void
  updateFamilyName: (
    stageKey: StageKey,
    familyId: string,
    name: string,
  ) => void
  updateScoreValue: (
    stageKey: StageKey,
    familyId: string,
    slotId: string,
    value: number,
  ) => void
  toggleScoreReveal: (
    stageKey: StageKey,
    familyId: string,
    slotId: string,
  ) => void
  resetStageRevealState: (stageKey: StageKey) => void
  resetStageData: (stageKey: StageKey) => void
  resetAllData: () => Promise<void>
}

const toPersistedData = (state: AppData): PersistedAppData => ({
  schemaVersion: APP_DATA_SCHEMA_VERSION,
  selectedStage: state.selectedStage,
  competitionData: state.competitionData,
})

const toAppData = (state: PersistedAppData): AppData => ({
  selectedStage: state.selectedStage,
  competitionData: state.competitionData,
})

let persistenceQueue = Promise.resolve()

const persist = (state: AppData): Promise<void> => {
  const data = toPersistedData(state)

  persistenceQueue = persistenceQueue
    .then(() => appDataService.save(data))
    .catch(() => undefined)

  return persistenceQueue
}

const clearPersistedData = (): Promise<void> => {
  persistenceQueue = persistenceQueue
    .then(() => appDataService.clear())
    .catch(() => undefined)

  return persistenceQueue
}

const updateFamily = (
  competitionData: CompetitionData,
  stageKey: StageKey,
  familyId: string,
  update: (family: Family) => Family,
): CompetitionData => {
  const stage = competitionData.stages[stageKey]

  return {
    stages: {
      ...competitionData.stages,
      [stageKey]: {
        ...stage,
        families: stage.families.map((family) =>
          family.id === familyId ? update(family) : family,
        ),
      },
    },
  }
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...createInitialData(),
  hydrationStatus: 'idle',

  initialize: async () => {
    if (get().hydrationStatus !== 'idle') {
      return
    }

    set({ hydrationStatus: 'loading' })

    try {
      const storedData = await appDataService.load()

      set({
        ...(storedData ? toAppData(storedData) : createInitialData()),
        hydrationStatus: 'ready',
      })
    } catch {
      set({ hydrationStatus: 'error' })
    }
  },

  selectStage: (selectedStage) => {
    set({ selectedStage })
    void persist(get())
  },

  updateFamilyName: (stageKey, familyId, name) => {
    set((state) => ({
      competitionData: updateFamily(
        state.competitionData,
        stageKey,
        familyId,
        (family) => ({ ...family, name }),
      ),
    }))
    void persist(get())
  },

  updateScoreValue: (stageKey, familyId, slotId, value) => {
    const safeValue = parseScoreValue(value)

    if (safeValue === null) {
      return
    }

    set((state) => ({
      competitionData: updateFamily(
        state.competitionData,
        stageKey,
        familyId,
        (family) => ({
          ...family,
          scoreSlots: family.scoreSlots.map((slot) =>
            slot.id === slotId ? { ...slot, value: safeValue } : slot,
          ),
        }),
      ),
    }))
    void persist(get())
  },

  toggleScoreReveal: (stageKey, familyId, slotId) => {
    set((state) => ({
      competitionData: updateFamily(
        state.competitionData,
        stageKey,
        familyId,
        (family) => ({
          ...family,
          scoreSlots: family.scoreSlots.map((slot) =>
            slot.id === slotId
              ? { ...slot, isRevealed: !slot.isRevealed }
              : slot,
          ),
        }),
      ),
    }))
    void persist(get())
  },

  resetStageRevealState: (stageKey) => {
    set((state) => {
      const stage = state.competitionData.stages[stageKey]

      return {
        competitionData: {
          stages: {
            ...state.competitionData.stages,
            [stageKey]: {
              ...stage,
              families: stage.families.map((family) => ({
                ...family,
                scoreSlots: family.scoreSlots.map((slot) => ({
                  ...slot,
                  isRevealed: false,
                })),
              })),
            },
          },
        },
      }
    })
    void persist(get())
  },

  resetStageData: (stageKey) => {
    set((state) => ({
      competitionData: {
        stages: {
          ...state.competitionData.stages,
          [stageKey]: createDefaultStageData(stageKey),
        },
      },
    }))
    void persist(get())
  },

  resetAllData: async () => {
    set({ ...createInitialData(), hydrationStatus: 'ready' })
    await clearPersistedData()
  },
}))
