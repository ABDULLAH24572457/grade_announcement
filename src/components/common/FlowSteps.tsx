import { useLocation } from 'react-router-dom'

import { ROUTES } from '@/constants/routes.constants'
import { cn } from '@/utils/cn'

const steps = [
  { label: 'المرحلة', path: ROUTES.stages },
  { label: 'النمط', path: ROUTES.modes },
  { label: 'الإعداد', path: ROUTES.setup },
  { label: 'العرض', path: ROUTES.presentation },
]

export const FlowSteps = () => {
  const { pathname } = useLocation()
  const activeIndex = Math.max(
    steps.findIndex((step) => step.path === pathname),
    0,
  )

  return (
    <nav aria-label="مراحل إعداد العرض" className="mb-8 sm:mb-12">
      <ol className="mx-auto flex max-w-2xl items-start justify-center">
        {steps.map((step, index) => (
          <li
            key={step.path}
            className={cn(
              'relative flex min-w-0 flex-1 flex-col items-center',
              index < steps.length - 1 &&
                'after:absolute after:right-[50%] after:top-4 after:h-px after:w-full after:bg-white/10 after:content-[""]',
              index < activeIndex &&
                'after:!bg-brand-300/50',
            )}
          >
            <span
              className={cn(
                'relative z-10 grid h-8 w-8 place-items-center rounded-full border bg-canvas text-xs font-bold transition',
                index === activeIndex &&
                  'border-brand-300 bg-brand-300 text-canvas shadow-glow',
                index < activeIndex &&
                  'border-brand-300/60 bg-brand-300/15 text-brand-200',
                index > activeIndex &&
                  'border-white/15 text-slate-500',
              )}
              aria-current={index === activeIndex ? 'step' : undefined}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                'mt-2 truncate text-[0.65rem] sm:text-xs',
                index === activeIndex ? 'text-white' : 'text-slate-500',
              )}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
