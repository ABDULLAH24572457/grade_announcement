export type StageKey = 'intermediate' | 'secondary'

export interface ScoreSlot {
  id: string
  label: string
  value: number
  isRevealed: boolean
}

export interface Family {
  id: string
  name: string
  scoreSlots: ScoreSlot[]
}

export interface StageData {
  key: StageKey
  label: string
  families: Family[]
}

export interface CompetitionData {
  stages: Record<StageKey, StageData>
}
