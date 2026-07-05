import type { CompetitionData, StageKey } from './competition.types'

export type HydrationStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface AppData {
  selectedStage: StageKey | null
  competitionData: CompetitionData
}

export interface PersistedAppData extends AppData {
  schemaVersion: number
}
