import { isSupabaseConfigured } from '@/services/supabase/supabase-client'
import type { PersistenceMode } from '@/types/app.types'

import type { CompetitionDataRepository } from './competition-data.repository'
import { localCompetitionDataRepository } from './local-competition-data.repository'
import { supabaseCompetitionDataRepository } from './supabase-competition-data.repository'

export const activePersistenceMode: PersistenceMode = isSupabaseConfigured
  ? 'supabase'
  : 'local'

export const activeCompetitionDataRepository: CompetitionDataRepository =
  isSupabaseConfigured
    ? supabaseCompetitionDataRepository
    : localCompetitionDataRepository
