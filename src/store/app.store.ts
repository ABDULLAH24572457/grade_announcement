import { create } from 'zustand'

import { APP_DATA_SCHEMA_VERSION } from '@/constants/app.constants'
import { appDataService } from '@/services/storage/app-data.service'
import type {
  AppData,
  EventDraft,
  HydrationStatus,
  PresentationModeId,
  StageId,
} from '@/types/app.types'

const initialData: AppData = {
  selectedStage: null,
  selectedMode: null,
  eventDraft: {
    title: '',
    category: '',
  },
}

interface AppStore extends AppData {
  hydrationStatus: HydrationStatus
  initialize: () => Promise<void>
  setStage: (stage: StageId) => void
  setMode: (mode: PresentationModeId) => void
  updateEventDraft: (draft: Partial<EventDraft>) => void
  reset: () => Promise<void>
}

const toPersistedData = (state: AppData) => ({
  schemaVersion: APP_DATA_SCHEMA_VERSION,
  selectedStage: state.selectedStage,
  selectedMode: state.selectedMode,
  eventDraft: state.eventDraft,
})

const persist = (state: AppData) => {
  void appDataService.save(toPersistedData(state))
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialData,
  hydrationStatus: 'idle',

  initialize: async () => {
    if (get().hydrationStatus !== 'idle') {
      return
    }

    set({ hydrationStatus: 'loading' })

    try {
      const storedData = await appDataService.load()

      set({
        ...(storedData ?? initialData),
        hydrationStatus: 'ready',
      })
    } catch {
      set({ hydrationStatus: 'error' })
    }
  },

  setStage: (selectedStage) => {
    set({ selectedStage })
    persist(get())
  },

  setMode: (selectedMode) => {
    set({ selectedMode })
    persist(get())
  },

  updateEventDraft: (draft) => {
    set((state) => ({
      eventDraft: { ...state.eventDraft, ...draft },
    }))
    persist(get())
  },

  reset: async () => {
    await appDataService.clear()
    set({ ...initialData, hydrationStatus: 'ready' })
  },
}))
