import type {
  CompetitionData,
  StageKey,
} from '@/types/competition.types'

export const setScoreRevealState = (
  data: CompetitionData,
  stageKey: StageKey,
  familyId: string,
  slotId: string,
  isRevealed: boolean,
): CompetitionData => {
  const stage = data.stages[stageKey]

  return {
    stages: {
      ...data.stages,
      [stageKey]: {
        ...stage,
        families: stage.families.map((family) =>
          family.id === familyId
            ? {
                ...family,
                scoreSlots: family.scoreSlots.map((slot) =>
                  slot.id === slotId ? { ...slot, isRevealed } : slot,
                ),
              }
            : family,
        ),
      },
    },
  }
}
