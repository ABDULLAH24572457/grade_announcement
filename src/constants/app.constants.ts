import type { StageKey } from '@/types/competition.types'

export const APP_NAME = 'منصة إعلان النتائج'
export const APP_DATA_SCHEMA_VERSION = 3
export const APP_STORAGE_KEY = 'competition-results-app'

export interface StageOption {
  id: StageKey
  title: string
}

export const STAGE_OPTIONS: StageOption[] = [
  {
    id: 'intermediate',
    title: 'متوسط',
  },
  {
    id: 'secondary',
    title: 'ثانوي',
  },
]
