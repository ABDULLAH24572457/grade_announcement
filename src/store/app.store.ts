import { create } from 'zustand'

import { APP_DATA_SCHEMA_VERSION } from '@/constants/app.constants'
import {
  createDefaultCompetitionData,
  createDefaultStageData,
} from '@/constants/default-competition-data'
import {
  activeCompetitionDataRepository,
  activePersistenceMode,
} from '@/services/data/active-competition-data.repository'
import { localCompetitionDataRepository } from '@/services/data/local-competition-data.repository'
import { supabaseCompetitionDataRepository } from '@/services/data/supabase-competition-data.repository'
import { appDataService } from '@/services/storage/app-data.service'
import type {
  AppData,
  HydrationStatus,
  PersistedAppData,
  PersistenceMode,
  RealtimeSyncStatus,
} from '@/types/app.types'
import type {
  CompetitionData,
  Family,
  StageKey,
} from '@/types/competition.types'
import { parseScoreValue } from '@/utils/score-validation'

const SUPABASE_FALLBACK_ERROR =
  'تعذر الاتصال بقاعدة البيانات. تم استخدام الحفظ المحلي.'
const PERSISTENCE_ERROR = 'تعذر حفظ البيانات.'
const LOCAL_LOAD_ERROR = 'تعذر تحميل البيانات المحلية.'

const createInitialData = (): AppData => ({
  selectedStage: null,
  competitionData: createDefaultCompetitionData(),
})

export interface AppStore extends AppData {
  hydrationStatus: HydrationStatus
  isLoading: boolean
  isSaving: boolean
  syncError: string | null
  lastSyncedAt: number | null
  persistenceMode: PersistenceMode
  realtimeStatus: RealtimeSyncStatus
  lastRemoteUpdateAt: number | null
  initialize: () => Promise<void>
  applyRemoteCompetitionData: (data: CompetitionData) => void
  setRealtimeStatus: (status: RealtimeSyncStatus) => void
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

let persistenceQueue = Promise.resolve()
let latestPersistenceRequest = 0

export const useAppStore = create<AppStore>((set, get) => {
  const queuePersistence = (task: () => Promise<void>): Promise<void> => {
    const requestId = ++latestPersistenceRequest
    set({ isSaving: true })

    const operation = persistenceQueue
      .then(task)
      .catch(() => {
        set({ syncError: PERSISTENCE_ERROR })
      })
      .finally(() => {
        if (requestId === latestPersistenceRequest) {
          set({ isSaving: false })
        }
      })

    persistenceQueue = operation
    return operation
  }

  const cacheLocalSnapshot = async (
    competitionData: CompetitionData,
  ): Promise<void> => {
    await appDataService.save(
      toPersistedData({
        selectedStage: get().selectedStage,
        competitionData,
      }),
    )
  }

  const persistCompetitionData = (
    competitionData: CompetitionData,
  ): Promise<void> =>
    queuePersistence(async () => {
      if (get().persistenceMode === 'supabase') {
        let savedLocally = false

        try {
          await cacheLocalSnapshot(competitionData)
          savedLocally = true
        } catch {
          // Supabase can still save even when browser storage is unavailable.
        }

        try {
          await supabaseCompetitionDataRepository.saveCompetitionData(
            competitionData,
          )
          set({
            lastSyncedAt: Date.now(),
            syncError: null,
          })
          return
        } catch {
          if (!savedLocally) {
            try {
              await localCompetitionDataRepository.saveCompetitionData(
                competitionData,
              )
              savedLocally = true
            } catch {
              savedLocally = false
            }
          }

          if (savedLocally) {
            set({
              persistenceMode: 'local',
              realtimeStatus: 'inactive',
              lastSyncedAt: Date.now(),
              syncError: SUPABASE_FALLBACK_ERROR,
            })
          } else {
            set({
              persistenceMode: 'local',
              realtimeStatus: 'inactive',
              syncError: PERSISTENCE_ERROR,
            })
          }
          return
        }
      }

      try {
        await localCompetitionDataRepository.saveCompetitionData(
          competitionData,
        )
        set((state) => ({
          lastSyncedAt: Date.now(),
          syncError:
            activePersistenceMode === 'supabase' ? state.syncError : null,
        }))
      } catch {
        set({ syncError: PERSISTENCE_ERROR })
      }
    })

  const persistSelectedStage = (): Promise<void> =>
    queuePersistence(async () => {
      try {
        await cacheLocalSnapshot(get().competitionData)
        if (get().persistenceMode === 'local') {
          set({ lastSyncedAt: Date.now() })
        }
      } catch {
        set({ syncError: PERSISTENCE_ERROR })
      }
    })

  return {
    ...createInitialData(),
    hydrationStatus: 'idle',
    isLoading: false,
    isSaving: false,
    syncError: null,
    lastSyncedAt: null,
    persistenceMode: activePersistenceMode,
    realtimeStatus: 'inactive',
    lastRemoteUpdateAt: null,

    initialize: async () => {
      if (get().hydrationStatus !== 'idle') {
        return
      }

      set({
        hydrationStatus: 'loading',
        isLoading: true,
        persistenceMode: activePersistenceMode,
      })

      const locallyStoredData = await appDataService
        .load()
        .catch(() => null)

      try {
        const competitionData =
          await activeCompetitionDataRepository.getCompetitionData()
        const selectedStage = locallyStoredData?.selectedStage ?? null

        set({
          selectedStage,
          competitionData,
          hydrationStatus: 'ready',
          isLoading: false,
          syncError: null,
          lastSyncedAt: Date.now(),
          persistenceMode: activePersistenceMode,
          realtimeStatus: 'inactive',
        })

        if (activePersistenceMode === 'supabase') {
          try {
            await cacheLocalSnapshot(competitionData)
          } catch {
            // The remote data remains usable even if local caching is blocked.
          }
        }
      } catch {
        set({
          selectedStage: locallyStoredData?.selectedStage ?? null,
          competitionData:
            locallyStoredData?.competitionData ??
            createDefaultCompetitionData(),
          hydrationStatus: 'ready',
          isLoading: false,
          syncError:
            activePersistenceMode === 'supabase'
              ? SUPABASE_FALLBACK_ERROR
              : LOCAL_LOAD_ERROR,
          persistenceMode: 'local',
          realtimeStatus: 'inactive',
        })
      }
    },

    applyRemoteCompetitionData: (competitionData) => {
      if (get().persistenceMode !== 'supabase' || get().isSaving) {
        return
      }

      set({
        competitionData,
        lastRemoteUpdateAt: Date.now(),
        realtimeStatus: 'connected',
      })

      void cacheLocalSnapshot(competitionData).catch(() => undefined)
    },

    setRealtimeStatus: (realtimeStatus) => {
      set({ realtimeStatus })
    },

    selectStage: (selectedStage) => {
      set({ selectedStage })
      void persistSelectedStage()
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
      void persistCompetitionData(get().competitionData)
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
      void persistCompetitionData(get().competitionData)
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
      void persistCompetitionData(get().competitionData)
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
      void persistCompetitionData(get().competitionData)
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
      void persistCompetitionData(get().competitionData)
    },

    resetAllData: async () => {
      const initialData = createInitialData()
      set({ ...initialData, hydrationStatus: 'ready' })
      await persistCompetitionData(initialData.competitionData)
      await persistSelectedStage()
    },
  }
})
