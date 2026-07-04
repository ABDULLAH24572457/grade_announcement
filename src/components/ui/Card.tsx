import type { HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'glass-panel rounded-2xl p-5 shadow-2xl shadow-black/10 sm:rounded-3xl sm:p-7',
      className,
    )}
    {...props}
  />
)
