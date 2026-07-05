import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import type { Family } from '@/types/competition.types'
import { cn } from '@/utils/cn'
import { calculateRevealedFamilyTotal } from '@/utils/competition-calculations'
import { formatScoreValue } from '@/utils/score-validation'

interface ResultsFamilyCardProps {
  family: Family
  onRevealScore: (familyId: string, slotId: string) => void
}

const getShortLabel = (label: string) => label.replace('الدرجة ', '')

export const ResultsFamilyCard = ({
  family,
  onRevealScore,
}: ResultsFamilyCardProps) => {
  const reduceMotion = useReducedMotion()
  const revealedTotal = calculateRevealedFamilyTotal(family)
  const familyName = family.name.trim() || 'أسرة بلا اسم'

  return (
    <article className="relative flex min-h-72 flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0c1929]/90 p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)] sm:min-h-80 sm:p-6 xl:min-h-[21rem]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 -top-16 h-28 rounded-full bg-brand-300/10 blur-3xl"
      />

      <div className="relative text-center">
        <h2
          className="truncate text-2xl font-bold text-white lg:text-3xl"
          title={familyName}
        >
          {familyName}
        </h2>
        <p className="mt-5 text-xs font-bold tracking-wide text-slate-400">
          المجموع الحالي
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.output
            key={revealedTotal}
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
            className="mt-1 block text-5xl font-bold leading-none text-brand-200 sm:text-6xl lg:text-7xl"
          >
            {formatScoreValue(revealedTotal)}
          </motion.output>
        </AnimatePresence>
      </div>

      {family.scoreSlots.length > 0 ? (
        <div className="relative mt-auto grid grid-cols-5 gap-2 pt-7 sm:gap-2.5">
          {family.scoreSlots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              disabled={slot.isRevealed}
              onClick={() => onRevealScore(family.id, slot.id)}
              aria-label={
                slot.isRevealed
                  ? `${slot.label}: ${formatScoreValue(slot.value)}`
                  : `كشف ${slot.label} لـ ${familyName}`
              }
              className={cn(
                'group relative flex min-h-20 min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border px-1 py-2 text-center transition duration-200 [perspective:700px] sm:min-h-24 lg:min-h-28',
                slot.isRevealed
                  ? 'cursor-default border-brand-300/35 bg-brand-300/[0.1] ring-1 ring-inset ring-brand-300/10 shadow-[inset_0_0_24px_rgba(34,211,238,0.04)]'
                  : 'cursor-pointer border-white/10 bg-[#07111f] hover:-translate-y-0.5 hover:border-brand-300/50 hover:bg-brand-300/[0.06]',
              )}
            >
              {slot.isRevealed && (
                <span
                  aria-hidden="true"
                  className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]"
                />
              )}
              <span
                className={cn(
                  'text-[0.6rem] font-bold sm:text-[0.7rem]',
                  slot.isRevealed ? 'text-brand-200/75' : 'text-slate-500',
                )}
              >
                {getShortLabel(slot.label)}
              </span>

              <AnimatePresence mode="wait" initial={false}>
                {slot.isRevealed ? (
                  <motion.span
                    key="score"
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, rotateY: -80, scale: 0.8 }
                    }
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-2 block text-lg font-bold text-white sm:text-2xl"
                  >
                    {formatScoreValue(slot.value)}
                  </motion.span>
                ) : (
                  <motion.span
                    key="cover"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={
                      reduceMotion
                        ? undefined
                        : { opacity: 0, rotateY: 80, scale: 0.8 }
                    }
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    className="mt-1 block text-3xl font-bold text-slate-500 transition-colors group-hover:text-brand-200 sm:text-4xl"
                  >
                    ؟
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      ) : (
        <p className="relative mt-auto pt-7 text-center text-sm text-slate-500">
          لا توجد درجات لهذه الأسرة.
        </p>
      )}
    </article>
  )
}
