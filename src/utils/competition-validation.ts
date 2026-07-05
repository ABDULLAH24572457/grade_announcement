import type {
  CompetitionData,
  Family,
  ScoreSlot,
  StageData,
  StageKey,
} from '@/types/competition.types'

import { isValidScoreValue } from './score-validation'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isScoreSlot = (value: unknown): value is ScoreSlot =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.label === 'string' &&
  isValidScoreValue(value.value) &&
  typeof value.isRevealed === 'boolean'

const isFamily = (value: unknown): value is Family =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.name === 'string' &&
  Array.isArray(value.scoreSlots) &&
  value.scoreSlots.every(isScoreSlot)

const isStageData = (value: unknown, stageKey: StageKey): value is StageData =>
  isRecord(value) &&
  value.key === stageKey &&
  typeof value.label === 'string' &&
  Array.isArray(value.families) &&
  value.families.every(isFamily)

export const isCompetitionData = (value: unknown): value is CompetitionData =>
  isRecord(value) &&
  isRecord(value.stages) &&
  isStageData(value.stages.intermediate, 'intermediate') &&
  isStageData(value.stages.secondary, 'secondary')
