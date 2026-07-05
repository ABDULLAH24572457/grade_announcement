import type { SupabaseClient } from '@supabase/supabase-js'

import { createDefaultCompetitionData } from '@/constants/default-competition-data'
import { supabaseClient } from '@/services/supabase/supabase-client'
import type {
  CompetitionData,
  StageKey,
} from '@/types/competition.types'
import { setScoreRevealState } from '@/utils/competition-data-updates'
import { isCompetitionData } from '@/utils/competition-validation'

import type { CompetitionDataRepository } from './competition-data.repository'

const SNAPSHOT_SLUG = 'main'
const SNAPSHOTS_TABLE = 'competition_snapshots'

class SupabaseCompetitionDataRepository implements CompetitionDataRepository {
  constructor(private readonly client: SupabaseClient | null) {}

  async getCompetitionData(): Promise<CompetitionData> {
    const client = this.getClient()
    const { data: snapshot, error } = await client
      .from(SNAPSHOTS_TABLE)
      .select('data')
      .eq('slug', SNAPSHOT_SLUG)
      .maybeSingle()

    if (error) {
      throw new Error('Unable to load competition data from Supabase.', {
        cause: error,
      })
    }

    if (snapshot && isCompetitionData(snapshot.data)) {
      return snapshot.data
    }

    const defaultData = createDefaultCompetitionData()
    await this.saveCompetitionData(defaultData)
    return defaultData
  }

  async saveCompetitionData(data: CompetitionData): Promise<void> {
    const client = this.getClient()
    const { error } = await client.from(SNAPSHOTS_TABLE).upsert(
      {
        slug: SNAPSHOT_SLUG,
        data,
      },
      { onConflict: 'slug' },
    )

    if (error) {
      throw new Error('Unable to save competition data to Supabase.', {
        cause: error,
      })
    }
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

  private getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase environment variables are not configured.')
    }

    return this.client
  }
}

export const supabaseCompetitionDataRepository =
  new SupabaseCompetitionDataRepository(supabaseClient)
