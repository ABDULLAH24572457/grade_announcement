import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { Family } from '@/types/competition.types'
import { calculateFullFamilyTotal } from '@/utils/competition-calculations'
import { formatScoreValue } from '@/utils/score-validation'

import { ScoreInput } from './ScoreInput'

interface SetupFamilyCardProps {
  family: Family
  familyIndex: number
  onNameChange: (familyId: string, name: string) => void
  onScoreChange: (familyId: string, slotId: string, value: number) => void
}

export const SetupFamilyCard = ({
  family,
  familyIndex,
  onNameChange,
  onScoreChange,
}: SetupFamilyCardProps) => {
  const familyNumber = (familyIndex + 1).toLocaleString('ar-SA')
  const total = calculateFullFamilyTotal(family)

  return (
    <Card className="overflow-hidden p-4 sm:p-6">
      <div className="grid items-end gap-4 border-b border-white/[0.07] pb-5 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Input
          id={`${family.id}-name`}
          label={`اسم الأسرة ${familyNumber}`}
          value={family.name}
          onChange={(event) => onNameChange(family.id, event.target.value)}
          autoComplete="off"
        />

        <div className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-brand-300/15 bg-brand-300/[0.06] px-4 sm:min-w-40 sm:flex-col sm:items-start sm:justify-center sm:gap-0">
          <span className="text-xs font-bold text-brand-200">المجموع الكامل</span>
          <output className="text-xl font-bold text-white" aria-live="polite">
            {formatScoreValue(total)}
          </output>
        </div>
      </div>

      {family.scoreSlots.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {family.scoreSlots.map((slot) => (
            <ScoreInput
              key={slot.id}
              id={`${family.id}-${slot.id}`}
              label={slot.label}
              value={slot.value}
              onValueChange={(value) =>
                onScoreChange(family.id, slot.id, value)
              }
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-slate-500">
          لا توجد خانات درجات لهذه الأسرة.
        </p>
      )}
    </Card>
  )
}
