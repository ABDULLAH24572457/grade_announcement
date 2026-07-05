import { useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/utils/cn'
import { parseScoreValue } from '@/utils/score-validation'

interface ScoreInputProps {
  id: string
  label: string
  value: number
  onValueChange: (value: number) => void
}

export const ScoreInput = ({
  id,
  label,
  onValueChange,
  value,
}: ScoreInputProps) => {
  const errorId = useId()
  const isEditingRef = useRef(false)
  const [draftValue, setDraftValue] = useState(String(value))
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!isEditingRef.current) {
      setDraftValue(String(value))
      setHasError(false)
    }
  }, [value])

  const handleChange = (nextValue: string) => {
    setDraftValue(nextValue)

    if (nextValue.trim() === '') {
      setHasError(false)
      return
    }

    const parsedValue = parseScoreValue(nextValue)

    if (parsedValue === null) {
      setHasError(true)
      return
    }

    setHasError(false)
    onValueChange(parsedValue)
  }

  const handleBlur = () => {
    isEditingRef.current = false
    const parsedValue = parseScoreValue(draftValue)

    if (parsedValue === null) {
      setDraftValue(String(value))
      setHasError(false)
      return
    }

    setDraftValue(String(parsedValue))
  }

  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="mb-2 block truncate text-xs font-bold text-slate-400 sm:text-sm">
        {label}
      </span>
      <input
        id={id}
        type="number"
        min="0"
        step="any"
        inputMode="decimal"
        value={draftValue}
        onFocus={() => {
          isEditingRef.current = true
        }}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleBlur}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={cn(
          'min-h-12 w-full rounded-xl border bg-canvas/60 px-3 text-center text-base font-bold text-white transition',
          'placeholder:text-slate-600 hover:border-white/20 focus:border-brand-300/60',
          hasError ? 'border-red-400/60' : 'border-white/10',
        )}
      />
      {hasError && (
        <span id={errorId} className="mt-1.5 block text-xs text-red-300">
          أدخل درجة موجبة أو صفرًا
        </span>
      )}
    </label>
  )
}
