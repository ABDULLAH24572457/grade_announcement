import { cn } from '@/utils/cn'

interface ArrowIconProps {
  direction?: 'forward' | 'back'
  className?: string
}

export const ArrowIcon = ({
  direction = 'forward',
  className,
}: ArrowIconProps) => (
  <svg
    aria-hidden="true"
    className={cn(
      'h-5 w-5',
      direction === 'back' && 'rotate-180',
      className,
    )}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
)
