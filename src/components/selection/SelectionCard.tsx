import { motion, useReducedMotion } from 'framer-motion'

import type { SelectionOption } from '@/constants/app.constants'
import { cn } from '@/utils/cn'

interface SelectionCardProps<T extends string> {
  option: SelectionOption<T>
  selected: boolean
  onSelect: (id: T) => void
}

export const SelectionCard = <T extends string>({
  onSelect,
  option,
  selected,
}: SelectionCardProps<T>) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(option.id)}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      className={cn(
        'group relative flex min-h-52 w-full flex-col overflow-hidden rounded-2xl border p-5 text-right transition sm:min-h-60 sm:rounded-3xl sm:p-7',
        selected
          ? 'border-brand-300/70 bg-brand-300/[0.09] shadow-glow'
          : 'border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]',
      )}
      aria-pressed={selected}
    >
      <span
        className={cn(
          'mb-auto inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold',
          selected
            ? 'border-brand-300/30 bg-brand-300/10 text-brand-200'
            : 'border-white/10 bg-white/5 text-slate-400',
        )}
      >
        {option.badge}
      </span>

      <span className="mt-8 block text-xl font-bold text-white sm:text-2xl">
        {option.title}
      </span>
      <span className="mt-2 block text-sm leading-7 text-slate-400 sm:text-base">
        {option.description}
      </span>

      <span
        className={cn(
          'absolute left-5 top-5 grid h-6 w-6 place-items-center rounded-full border transition sm:left-7 sm:top-7',
          selected
            ? 'border-brand-300 bg-brand-300 text-canvas'
            : 'border-white/20 text-transparent',
        )}
        aria-hidden="true"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </span>
    </motion.button>
  )
}
