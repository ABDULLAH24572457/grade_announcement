import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { SetupFamilyCard } from '@/components/setup/SetupFamilyCard'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { ActionLink, Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useAppStore } from '@/store/app.store'

const SAVE_MESSAGE_DURATION = 2500

export const ResultsSetupPage = () => {
  useDocumentTitle('إعداد النتائج')
  const selectedStage = useAppStore((state) => state.selectedStage)
  const stage = useAppStore((state) =>
    state.selectedStage
      ? state.competitionData.stages[state.selectedStage]
      : undefined,
  )
  const updateFamilyName = useAppStore((state) => state.updateFamilyName)
  const updateScoreValue = useAppStore((state) => state.updateScoreValue)
  const resetStageData = useAppStore((state) => state.resetStageData)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const saveMessageTimeoutRef = useRef<number | null>(null)

  const closeResetDialog = useCallback(() => {
    setIsResetDialogOpen(false)
  }, [])

  const confirmReset = useCallback(() => {
    if (selectedStage) {
      resetStageData(selectedStage)
    }
    setIsResetDialogOpen(false)
  }, [resetStageData, selectedStage])

  const showSaveFeedback = useCallback(() => {
    if (saveMessageTimeoutRef.current !== null) {
      window.clearTimeout(saveMessageTimeoutRef.current)
    }

    setSaveMessage('تم حفظ التعديلات بنجاح')
    saveMessageTimeoutRef.current = window.setTimeout(() => {
      setSaveMessage('')
      saveMessageTimeoutRef.current = null
    }, SAVE_MESSAGE_DURATION)
  }, [])

  useEffect(
    () => () => {
      if (saveMessageTimeoutRef.current !== null) {
        window.clearTimeout(saveMessageTimeoutRef.current)
      }
    },
    [],
  )

  if (!selectedStage || !stage) {
    return <Navigate to={ROUTES.home} replace />
  }

  return (
    <PageTransition className="page-container w-full py-8 sm:py-12">
      <PageHeader
        title={`إعداد نتائج مرحلة ${stage.label}`}
        description="عدّل أسماء الأسر والدرجات. تُحفظ جميع التغييرات تلقائيًا على هذا الجهاز."
      />

      {stage.families.length > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          {stage.families.map((family, familyIndex) => (
            <SetupFamilyCard
              key={family.id}
              family={family}
              familyIndex={familyIndex}
              onNameChange={(familyId, name) =>
                updateFamilyName(selectedStage, familyId, name)
              }
              onScoreChange={(familyId, slotId, value) =>
                updateScoreValue(selectedStage, familyId, slotId, value)
              }
            />
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <p className="font-bold text-white">لا توجد أسر في هذه المرحلة</p>
        </Card>
      )}

      <div
        className="mt-6 min-h-11 text-center sm:text-left"
        aria-live="polite"
        aria-atomic="true"
      >
        {saveMessage && (
          <p
            role="status"
            className="inline-flex rounded-xl border border-emerald-300/20 bg-emerald-300/[0.08] px-4 py-2.5 text-sm font-bold text-emerald-200"
          >
            {saveMessage}
          </p>
        )}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ActionLink to={ROUTES.actions} variant="ghost" size="lg" fullWidth>
          <ArrowIcon direction="back" />
          رجوع
        </ActionLink>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          className="border-red-300/20 text-red-200 hover:border-red-300/35 hover:bg-red-300/[0.08]"
          onClick={() => setIsResetDialogOpen(true)}
        >
          إعادة ضبط المرحلة
        </Button>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={showSaveFeedback}
        >
          حفظ التعديلات
        </Button>
        <ActionLink to={ROUTES.results} size="lg" fullWidth>
          معاينة العرض
        </ActionLink>
      </div>

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="إعادة ضبط المرحلة؟"
        description="هل أنت متأكد من إعادة ضبط هذه المرحلة؟ سيتم حذف أسماء الأسر والدرجات لهذه المرحلة فقط."
        confirmLabel="نعم، إعادة الضبط"
        onConfirm={confirmReset}
        onCancel={closeResetDialog}
      />
    </PageTransition>
  )
}
