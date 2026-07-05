import type {
  CompetitionData,
  StageKey,
} from '@/types/competition.types'

export interface CompetitionDataRepository {
  getCompetitionData(): Promise<CompetitionData>
  saveCompetitionData(data: CompetitionData): Promise<void>
  resetCompetitionData(): Promise<CompetitionData>
  updateRevealState(
    stageKey: StageKey,
    familyId: string,
    slotId: string,
    isRevealed: boolean,
  ): Promise<CompetitionData>
}
