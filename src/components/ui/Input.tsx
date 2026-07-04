import type { InputHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export const Input = ({ className, hint, id, label, ...props }: InputProps) => {
  const inputId = id ?? props.name

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-bold text-slate-200">{label}</span>
      <input
        id={inputId}
        className={cn(
          'min-h-12 w-full rounded-xl border border-white/10 bg-canvas/60 px-4 text-base text-white',
          'placeholder:text-slate-500 hover:border-white/20 focus:border-brand-300/60',
          className,
        )}
        {...props}
      />
      {hint && <span className="mt-2 block text-xs text-slate-400">{hint}</span>}
    </label>
  )
}
