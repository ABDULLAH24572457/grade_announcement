import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const buttonStyles = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: ButtonStyleProps) =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition duration-200',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variant === 'primary' &&
      'bg-brand-300 text-canvas shadow-glow hover:bg-brand-200 active:scale-[0.98]',
    variant === 'secondary' &&
      'border border-white/15 bg-white/[0.06] text-white hover:border-brand-300/40 hover:bg-white/10',
    variant === 'ghost' && 'text-slate-300 hover:bg-white/[0.06] hover:text-white',
    size === 'sm' && 'min-h-10 px-4 text-sm',
    size === 'md' && 'min-h-12 px-5 text-sm sm:text-base',
    size === 'lg' && 'min-h-14 px-7 text-base sm:text-lg',
    fullWidth && 'w-full',
  )

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleProps {}

export const Button = ({
  className,
  variant,
  size,
  fullWidth,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(buttonStyles({ variant, size, fullWidth }), className)}
    {...props}
  />
)

interface ActionLinkProps extends LinkProps, ButtonStyleProps {
  children: ReactNode
}

export const ActionLink = ({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ActionLinkProps) => (
  <Link
    className={cn(buttonStyles({ variant, size, fullWidth }), className)}
    {...props}
  />
)
