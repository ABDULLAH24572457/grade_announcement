import type { CompetitionData, StageKey } from './competition.types'

export type HydrationStatus = 'idle' | 'loading' | 'ready' | 'error'
export type PersistenceMode = 'local' | 'supabase'
export type RealtimeSyncStatus =
  | 'inactive'
  | 'connecting'
  | 'connected'
  | 'error'

export interface AppData {
  selectedStage: StageKey | null
  competitionData: CompetitionData
}

export interface PersistedAppData extends AppData {
  schemaVersion: number
}
