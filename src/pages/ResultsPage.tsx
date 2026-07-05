import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { PageTransition } from '@/components/common/PageTransition'
import { PersistenceStatus } from '@/components/common/PersistenceStatus'
import { ResultsFamilyCard } from '@/components/results/ResultsFamilyCard'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { ActionLink, Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useFullscreen } from '@/hooks/use-fullscreen'
import { useAppStore } from '@/store/app.store'
import { calculateStageFullTotal } from '@/utils/competition-calculations'

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
    target.isContentEditable
  )
}

export const ResultsPage = () => {
  useDocumentTitle('عرض النتائج')
  const selectedStage = useAppStore((state) => state.selectedStage)
  const stage = useAppStore((state) =>
    state.selectedStage
      ? state.competitionData.stages[state.selectedStage]
      : undefined,
  )
  const toggleScoreReveal = useAppStore((state) => state.toggleScoreReveal)
  const resetStageRevealState = useAppStore(
    (state) => state.resetStageRevealState,
  )
  const {
    exitFullscreen,
    isFullscreen,
    isFullscreenAvailable,
    toggleFullscreen,
  } = useFullscreen()
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  const openResetDialog = useCallback(() => {
    setIsResetDialogOpen(true)
  }, [])

  const closeResetDialog = useCallback(() => {
    setIsResetDialogOpen(false)
  }, [])

  const confirmReset = useCallback(() => {
    if (selectedStage) {
      resetStageRevealState(selectedStage)
    }
    setIsResetDialogOpen(false)
  }, [resetStageRevealState, selectedStage])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isTypingTarget(event.target)
      ) {
        return
      }

      if (isResetDialogOpen) {
        if (event.key === 'Escape' && document.fullscreenElement) {
          void exitFullscreen()
        }
        return
      }

      const key = event.key.toLowerCase()

      if (key === 'f') {
        event.preventDefault()
        void toggleFullscreen()
      } else if (key === 'r') {
        event.preventDefault()
        openResetDialog()
      } else if (event.key === 'Escape' && document.fullscreenElement) {
        void exitFullscreen()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    exitFullscreen,
    isResetDialogOpen,
    openResetDialog,
    toggleFullscreen,
  ])

  if (!selectedStage || !stage) {
    return <Navigate to={ROUTES.home} replace />
  }

  const allScoresAreZero = calculateStageFullTotal(stage) === 0

  return (
    <PageTransition className="relative min-h-screen w-full overflow-hidden bg-[#050b14]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-0 h-[34rem] w-[34rem] rounded-full bg-brand-400/[0.07] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 bottom-0 h-[30rem] w-[30rem] rounded-full bg-blue-500/[0.05] blur-3xl"
      />

      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#050b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 xl:px-12 2xl:px-16">
          <div>
            <p className="text-xs font-bold text-brand-300 sm:text-sm">
              مرحلة {stage.label}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              عرض النتائج
            </h1>
            <PersistenceStatus className="mt-2" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <ActionLink
              to={ROUTES.actions}
              variant="secondary"
              className="min-h-11"
            >
              <ArrowIcon direction="back" />
              رجوع
            </ActionLink>
            <Button
              variant="secondary"
              className="min-h-11"
              disabled={!isFullscreenAvailable}
              onClick={() => void toggleFullscreen()}
              title={
                isFullscreenAvailable ? undefined : 'ملء الشاشة غير متاح'
              }
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
              </svg>
              {isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة'}
            </Button>
            <Button
              variant="secondary"
              className="col-span-2 min-h-11 border-red-300/20 text-red-200 hover:border-red-300/35 hover:bg-red-300/[0.08]"
              onClick={openResetDialog}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              إعادة إخفاء الدرجات
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-12 2xl:px-16">
        <p className="mb-4 text-center text-sm text-slate-400 sm:text-base">
          اضغط على الخانة لكشف الدرجة وإضافتها مباشرة إلى مجموع الأسرة.
        </p>

        {allScoresAreZero && (
          <p
            role="note"
            className="mx-auto mb-5 w-fit rounded-xl border border-amber-300/20 bg-amber-300/[0.07] px-4 py-2 text-center text-sm font-bold text-amber-100 sm:mb-7"
          >
            تنبيه: جميع الدرجات في هذه المرحلة تساوي صفر.
          </p>
        )}

        {stage.families.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5 2xl:gap-6">
            {stage.families.map((family) => (
              <ResultsFamilyCard
                key={family.id}
                family={family}
                onRevealScore={(familyId, slotId) => {
                  const slot = family.scoreSlots.find(
                    (scoreSlot) => scoreSlot.id === slotId,
                  )

                  if (slot && !slot.isRevealed) {
                    toggleScoreReveal(selectedStage, familyId, slotId)
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] py-16 text-center">
            <p className="text-lg font-bold text-white">لا توجد أسر لعرضها</p>
            <p className="mt-2 text-sm text-slate-400">
              انتقل إلى إعداد النتائج لإضافة البيانات.
            </p>
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="إعادة إخفاء الدرجات؟"
        description="هل أنت متأكد من إعادة إخفاء جميع الدرجات؟ لن يتم حذف الأسماء أو الدرجات."
        confirmLabel="نعم، إعادة الإخفاء"
        onConfirm={confirmReset}
        onCancel={closeResetDialog}
      />
    </PageTransition>
  )
}
