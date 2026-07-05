const SCORE_PRECISION = 10

export const normalizeScorePrecision = (value: number): number => {
  const normalizedValue = Number(value.toFixed(SCORE_PRECISION))
  return Object.is(normalizedValue, -0) ? 0 : normalizedValue
}

export const parseScoreValue = (value: unknown): number | null => {
  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return null
  }

  const numericValue = typeof value === 'number' ? value : Number(value)

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return null
  }

  return normalizeScorePrecision(numericValue)
}

export const isValidScoreValue = (value: unknown): value is number =>
  typeof value === 'number' && parseScoreValue(value) !== null

const scoreFormatter = new Intl.NumberFormat('ar-SA', {
  maximumFractionDigits: SCORE_PRECISION,
})

export const formatScoreValue = (value: number): string =>
  scoreFormatter.format(normalizeScorePrecision(value))
