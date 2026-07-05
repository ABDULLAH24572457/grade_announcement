import type { Family, StageData } from '@/types/competition.types'

import { normalizeScorePrecision } from './score-validation'

const sumScores = (scores: number[]): number =>
  normalizeScorePrecision(scores.reduce((total, score) => total + score, 0))

export const calculateFullFamilyTotal = (family: Family): number =>
  sumScores(family.scoreSlots.map((slot) => slot.value))

export const calculateRevealedFamilyTotal = (family: Family): number =>
  sumScores(
    family.scoreSlots
      .filter((slot) => slot.isRevealed)
      .map((slot) => slot.value),
  )

export const calculateStageFullTotal = (stage: StageData): number =>
  sumScores(stage.families.map(calculateFullFamilyTotal))

export const calculateStageRevealedTotal = (stage: StageData): number =>
  sumScores(stage.families.map(calculateRevealedFamilyTotal))
