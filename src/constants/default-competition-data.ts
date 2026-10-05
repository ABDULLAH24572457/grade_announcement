import type {
  CompetitionData,
  Family,
  ScoreSlot,
  StageData,
  StageKey,
} from '@/types/competition.types'

export const SCORE_SLOT_LABELS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
] as const

export const DEFAULT_FAMILY_COUNTS: Record<StageKey, number> = {
  intermediate: 8,
  secondary: 6,
}

export const MIN_FAMILY_COUNT = 1
export const MAX_FAMILY_COUNT = 50

export const STAGE_LABELS: Record<StageKey, string> = {
  intermediate: 'تبيان1',
  secondary: 'تبيان2',
}

const createScoreSlots = (stageKey: StageKey, familyIndex: number): ScoreSlot[] =>
  SCORE_SLOT_LABELS.map((label, slotIndex) => ({
    id: `${stageKey}-family-${familyIndex + 1}-score-${slotIndex + 1}`,
    label,
    value: 0,
    isRevealed: false,
  }))

export const createFamily = (
  stageKey: StageKey,
  familyIndex: number,
): Family => ({
  id: `${stageKey}-family-${familyIndex + 1}`,
  name: `الأسرة ${familyIndex + 1}`,
  scoreSlots: createScoreSlots(stageKey, familyIndex),
})

const createFamilies = (stageKey: StageKey, count: number): Family[] =>
  Array.from({ length: count }, (_, familyIndex) =>
    createFamily(stageKey, familyIndex),
  )

export const resizeFamilies = (
  stageKey: StageKey,
  families: Family[],
  requestedCount: number,
): Family[] => {
  const normalizedCount = Number.isFinite(requestedCount)
    ? Math.trunc(requestedCount)
    : families.length
  const count = Math.min(
    MAX_FAMILY_COUNT,
    Math.max(MIN_FAMILY_COUNT, normalizedCount),
  )

  if (count <= families.length) {
    return families.slice(0, count)
  }

  return [
    ...families,
    ...Array.from({ length: count - families.length }, (_, offset) =>
      createFamily(stageKey, families.length + offset),
    ),
  ]
}

export const createDefaultStageData = (
  stageKey: StageKey,
  familyCount = DEFAULT_FAMILY_COUNTS[stageKey],
): StageData => ({
  key: stageKey,
  label: STAGE_LABELS[stageKey],
  families: createFamilies(stageKey, familyCount),
})

export const createDefaultCompetitionData = (): CompetitionData => ({
  stages: {
    intermediate: createDefaultStageData('intermediate'),
    secondary: createDefaultStageData('secondary'),
  },
})

export const DEFAULT_COMPETITION_DATA = createDefaultCompetitionData()
