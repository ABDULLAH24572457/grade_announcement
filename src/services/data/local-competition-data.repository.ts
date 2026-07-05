import { APP_DATA_SCHEMA_VERSION } from '@/constants/app.constants'
import { createDefaultCompetitionData } from '@/constants/default-competition-data'
import { appDataService } from '@/services/storage/app-data.service'
import type { PersistedAppData } from '@/types/app.types'
import type {
  CompetitionData,
  StageKey,
} from '@/types/competition.types'
import { setScoreRevealState } from '@/utils/competition-data-updates'

import type { CompetitionDataRepository } from './competition-data.repository'

class LocalCompetitionDataRepository implements CompetitionDataRepository {
  async getCompetitionData(): Promise<CompetitionData> {
    const storedData = await appDataService.load()
    return storedData?.competitionData ?? createDefaultCompetitionData()
  }

  async saveCompetitionData(data: CompetitionData): Promise<void> {
    const storedData = await appDataService.load()
    const nextAppData: PersistedAppData = {
      schemaVersion: APP_DATA_SCHEMA_VERSION,
      selectedStage: storedData?.selectedStage ?? null,
      competitionData: data,
    }

    await appDataService.save(nextAppData)
  }

  async resetCompetitionData(): Promise<CompetitionData> {
    const defaultData = createDefaultCompetitionData()
    await this.saveCompetitionData(defaultData)
    return defaultData
  }

  async updateRevealState(
    stageKey: StageKey,
    familyId: string,
    slotId: string,
    isRevealed: boolean,
  ): Promise<CompetitionData> {
    const currentData = await this.getCompetitionData()
    const nextData = setScoreRevealState(
      currentData,
      stageKey,
      familyId,
      slotId,
      isRevealed,
    )

    await this.saveCompetitionData(nextData)
    return nextData
  }
}

export const localCompetitionDataRepository =
  new LocalCompetitionDataRepository()
