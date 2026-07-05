import type {
  CompetitionData,
  Family,
  ScoreSlot,
  StageData,
  StageKey,
} from '@/types/competition.types'

export const SCORE_SLOT_LABELS = [
  'الدرجة الأولى',
  'الدرجة الثانية',
  'الدرجة الثالثة',
  'الدرجة الرابعة',
  'الدرجة الخامسة',
] as const

export const DEFAULT_FAMILY_COUNTS: Record<StageKey, number> = {
  intermediate: 8,
  secondary: 6,
}

export const STAGE_LABELS: Record<StageKey, string> = {
  intermediate: 'متوسط',
  secondary: 'ثانوي',
}

const createScoreSlots = (stageKey: StageKey, familyIndex: number): ScoreSlot[] =>
  SCORE_SLOT_LABELS.map((label, slotIndex) => ({
    id: `${stageKey}-family-${familyIndex + 1}-score-${slotIndex + 1}`,
    label,
    value: 0,
    isRevealed: false,
  }))

const createFamilies = (stageKey: StageKey, count: number): Family[] =>
  Array.from({ length: count }, (_, familyIndex) => ({
    id: `${stageKey}-family-${familyIndex + 1}`,
    name: `الأسرة ${familyIndex + 1}`,
    scoreSlots: createScoreSlots(stageKey, familyIndex),
  }))

export const createDefaultStageData = (stageKey: StageKey): StageData => ({
  key: stageKey,
  label: STAGE_LABELS[stageKey],
  families: createFamilies(stageKey, DEFAULT_FAMILY_COUNTS[stageKey]),
})

export const createDefaultCompetitionData = (): CompetitionData => ({
  stages: {
    intermediate: createDefaultStageData('intermediate'),
    secondary: createDefaultStageData('secondary'),
  },
})

export const DEFAULT_COMPETITION_DATA = createDefaultCompetitionData()
