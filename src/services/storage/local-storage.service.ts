import {
  APP_DATA_SCHEMA_VERSION,
  APP_STORAGE_KEY,
} from '@/constants/app.constants'
import { createDefaultCompetitionData } from '@/constants/default-competition-data'
import type { PersistedAppData } from '@/types/app.types'
import type { StageKey } from '@/types/competition.types'
import { isCompetitionData } from '@/utils/competition-validation'

import type { AppDataService } from './app-data-service.types'

const stageKeys: StageKey[] = ['intermediate', 'secondary']

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStageKey = (value: unknown): value is StageKey | null =>
  value === null ||
  (typeof value === 'string' && stageKeys.includes(value as StageKey))

const isPersistedAppData = (value: unknown): value is PersistedAppData =>
  isRecord(value) &&
  value.schemaVersion === APP_DATA_SCHEMA_VERSION &&
  isStageKey(value.selectedStage) &&
  isCompetitionData(value.competitionData)

const migrateLegacyData = (value: unknown): PersistedAppData | null => {
  if (!isRecord(value) || (value.schemaVersion !== 1 && value.schemaVersion !== 2)) {
    return null
  }

  const competitionData = isCompetitionData(value.competitionData)
    ? value.competitionData
    : createDefaultCompetitionData()

  return {
    schemaVersion: APP_DATA_SCHEMA_VERSION,
    selectedStage: isStageKey(value.selectedStage) ? value.selectedStage : null,
    competitionData,
  }
}

export class LocalStorageAppDataService implements AppDataService {
  async load(): Promise<PersistedAppData | null> {
    const serializedData = window.localStorage.getItem(APP_STORAGE_KEY)

    if (!serializedData) {
      return null
    }

    try {
      const parsedData: unknown = JSON.parse(serializedData)

      if (isPersistedAppData(parsedData)) {
        return parsedData
      }

      const migratedData = migrateLegacyData(parsedData)

      if (migratedData) {
        window.localStorage.setItem(
          APP_STORAGE_KEY,
          JSON.stringify(migratedData),
        )
      }

      return migratedData
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
