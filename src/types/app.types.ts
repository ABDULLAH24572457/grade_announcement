export type StageId = 'qualifiers' | 'semifinal' | 'final'

export type PresentationModeId = 'leaderboard' | 'podium' | 'live-score'

export type HydrationStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface EventDraft {
  title: string
  category: string
}

export interface AppData {
  selectedStage: StageId | null
  selectedMode: PresentationModeId | null
  eventDraft: EventDraft
}

export interface PersistedAppData extends AppData {
  schemaVersion: number
}
