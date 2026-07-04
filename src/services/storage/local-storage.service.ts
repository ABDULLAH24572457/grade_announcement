import {
  APP_DATA_SCHEMA_VERSION,
  APP_STORAGE_KEY,
} from '@/constants/app.constants'
import type { PersistedAppData } from '@/types/app.types'

import type { AppDataService } from './app-data-service.types'

const isPersistedAppData = (value: unknown): value is PersistedAppData => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<PersistedAppData>

  return (
    candidate.schemaVersion === APP_DATA_SCHEMA_VERSION &&
    (candidate.selectedStage === null ||
      ['qualifiers', 'semifinal', 'final'].includes(candidate.selectedStage ?? '')) &&
    (candidate.selectedMode === null ||
      ['leaderboard', 'podium', 'live-score'].includes(candidate.selectedMode ?? '')) &&
    typeof candidate.eventDraft?.title === 'string' &&
    typeof candidate.eventDraft?.category === 'string'
  )
}

export class LocalStorageAppDataService implements AppDataService {
  async load(): Promise<PersistedAppData | null> {
    const serializedData = window.localStorage.getItem(APP_STORAGE_KEY)

    if (!serializedData) {
      return null
    }

    try {
      const data: unknown = JSON.parse(serializedData)
      return isPersistedAppData(data) ? data : null
    } catch {
      return null
    }
  }

  async save(data: PersistedAppData): Promise<void> {
    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data))
  }

  async clear(): Promise<void> {
    window.localStorage.removeItem(APP_STORAGE_KEY)
  }
}
