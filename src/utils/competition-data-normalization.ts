import { SCORE_SLOT_LABELS } from '@/constants/default-competition-data'
import type { CompetitionData } from '@/types/competition.types'

export const normalizeCompetitionScoreSlots = (
  competitionData: CompetitionData,
): CompetitionData => ({
  stages: {
    intermediate: normalizeStage(competitionData, 'intermediate'),
    secondary: normalizeStage(competitionData, 'secondary'),
  },
})

const normalizeStage = (
  competitionData: CompetitionData,
  stageKey: keyof CompetitionData['stages'],
) => {
  const stage = competitionData.stages[stageKey]

  return {
    ...stage,
    families: stage.families.map((family) => ({
      ...family,
      scoreSlots: SCORE_SLOT_LABELS.map((label, slotIndex) => {
        const existingSlot = family.scoreSlots[slotIndex]

        return existingSlot
          ? { ...existingSlot, label }
          : {
              id: `${family.id}-score-${slotIndex + 1}`,
              label,
              value: 0,
              isRevealed: false,
            }
      }),
    })),
  }
}
