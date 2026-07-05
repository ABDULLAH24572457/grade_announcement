import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  cancelLabel = 'إلغاء',
  confirmLabel,
  description,
  isOpen,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) => {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previouslyFocusedElement = document.activeElement as HTMLElement | null
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCancel()
      }
    }

    dialogRef.current?.focus()
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedElement?.focus()
    }
  }, [isOpen, onCancel])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#030812]/85 p-4 backdrop-blur-sm"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onCancel()
            }
          }}
        >
          <motion.div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0c1929] p-6 shadow-2xl shadow-black/50 sm:p-8"
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? undefined
                : { opacity: 0, y: 8, scale: 0.98 }
            }
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <h2 id={titleId} className="text-xl font-bold text-white sm:text-2xl">
              {title}
            </h2>
            <p
              id={descriptionId}
              className="mt-3 text-sm leading-7 text-slate-300 sm:text-base"
            >
              {description}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button
                variant="secondary"
                className="border-red-300/25 text-red-200 hover:border-red-300/40 hover:bg-red-300/[0.08]"
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
