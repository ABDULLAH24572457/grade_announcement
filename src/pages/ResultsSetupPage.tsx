import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { SetupAccessGate } from '@/components/setup/SetupAccessGate'
import { SetupFamilyCard } from '@/components/setup/SetupFamilyCard'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { ActionLink, Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  MAX_FAMILY_COUNT,
  MIN_FAMILY_COUNT,
} from '@/constants/default-competition-data'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useSetupAccess } from '@/hooks/use-setup-access'
import { useAppStore } from '@/store/app.store'
import { calculateStageFullTotal } from '@/utils/competition-calculations'

const SAVE_MESSAGE_DURATION = 2500

export const ResultsSetupPage = () => {
  useDocumentTitle('إعداد النتائج')
  const navigate = useNavigate()
  const { isProtectionEnabled, isUnlocked, lock, unlock } =
    useSetupAccess()
  const selectedStage = useAppStore((state) => state.selectedStage)
  const stage = useAppStore((state) =>
    state.selectedStage
      ? state.competitionData.stages[state.selectedStage]
      : undefined,
  )
  const updateFamilyName = useAppStore((state) => state.updateFamilyName)
  const updateScoreValue = useAppStore((state) => state.updateScoreValue)
  const setFamilyCount = useAppStore((state) => state.setFamilyCount)
  const resetStageData = useAppStore((state) => state.resetStageData)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [pendingFamilyCount, setPendingFamilyCount] = useState<number | null>(
    null,
  )
  const [previewWarning, setPreviewWarning] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState('')
  const saveMessageTimeoutRef = useRef<number | null>(null)

  const closeResetDialog = useCallback(() => {
    setIsResetDialogOpen(false)
  }, [])

  const closeFamilyCountDialog = useCallback(() => {
    setPendingFamilyCount(null)
  }, [])

  const confirmFamilyCount = useCallback(() => {
    if (selectedStage && pendingFamilyCount !== null) {
      setFamilyCount(selectedStage, pendingFamilyCount)
    }
    setPendingFamilyCount(null)
  }, [pendingFamilyCount, selectedStage, setFamilyCount])

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

  const lockSetup = useCallback(() => {
    if (saveMessageTimeoutRef.current !== null) {
      window.clearTimeout(saveMessageTimeoutRef.current)
      saveMessageTimeoutRef.current = null
    }

    setSaveMessage('')
    setIsResetDialogOpen(false)
    setPreviewWarning(null)
    lock()
  }, [lock])

  const closePreviewWarning = useCallback(() => {
    setPreviewWarning(null)
  }, [])

  const continueToPreview = useCallback(() => {
    setPreviewWarning(null)
    navigate(ROUTES.results)
  }, [navigate])

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

  if (isProtectionEnabled && !isUnlocked) {
    return <SetupAccessGate onUnlock={unlock} />
  }

  const openPreview = () => {
    const warnings: string[] = []

    if (stage.families.some((family) => family.name.trim() === '')) {
      warnings.push('تنبيه: توجد أسماء أسر فارغة.')
    }

    if (calculateStageFullTotal(stage) === 0) {
      warnings.push('تنبيه: جميع الدرجات في هذه المرحلة تساوي صفر.')
    }

    if (warnings.length > 0) {
      setPreviewWarning(`${warnings.join(' ')} هل تريد المتابعة؟`)
      return
    }

    navigate(ROUTES.results)
  }

  const changeFamilyCount = (count: number) => {
    const safeCount = Math.min(
      MAX_FAMILY_COUNT,
      Math.max(MIN_FAMILY_COUNT, count),
    )

    if (safeCount === stage.families.length) {
      return
    }

    if (safeCount < stage.families.length) {
      setPendingFamilyCount(safeCount)
      return
    }

    setFamilyCount(selectedStage, safeCount)
  }

  return (
    <PageTransition className="page-container w-full py-8 sm:py-12">
      {isProtectionEnabled && (
        <div className="mb-4 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="min-h-11"
            onClick={lockSetup}
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="16" height="11" x="4" y="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            قفل الإعدادات
          </Button>
        </div>
      )}

      <PageHeader
        title={`إعداد نتائج مرحلة ${stage.label}`}
        description="حدّد عدد الأسر، ثم عدّل أسماءها ودرجاتها. تُحفظ جميع التغييرات تلقائيًا."
      />

      <Card className="mb-5 sm:mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">عدد الأسر</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              يمكنك اختيار عدد من {MIN_FAMILY_COUNT.toLocaleString('ar-SA')} إلى{' '}
              {MAX_FAMILY_COUNT.toLocaleString('ar-SA')} أسرة.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3" dir="ltr">
            <Button
              variant="secondary"
              size="sm"
              className="h-12 min-h-12 w-12 px-0 text-2xl"
              aria-label="تقليل عدد الأسر"
              disabled={stage.families.length <= MIN_FAMILY_COUNT}
              onClick={() => changeFamilyCount(stage.families.length - 1)}
            >
              −
            </Button>
            <input
              aria-label="عدد الأسر"
              className="h-12 w-24 rounded-xl border border-white/10 bg-canvas/60 px-3 text-center text-lg font-bold text-white hover:border-white/20 focus:border-brand-300/60"
              type="number"
              min={MIN_FAMILY_COUNT}
              max={MAX_FAMILY_COUNT}
              value={stage.families.length}
              onChange={(event) => {
                const count = event.currentTarget.valueAsNumber
                if (Number.isInteger(count)) {
                  changeFamilyCount(count)
                }
              }}
            />
            <Button
              variant="secondary"
              size="sm"
              className="h-12 min-h-12 w-12 px-0 text-2xl"
              aria-label="زيادة عدد الأسر"
              disabled={stage.families.length >= MAX_FAMILY_COUNT}
              onClick={() => changeFamilyCount(stage.families.length + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </Card>

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
        <Button type="button" size="lg" fullWidth onClick={openPreview}>
          معاينة العرض
        </Button>
      </div>

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="إعادة ضبط المرحلة؟"
        description="هل أنت متأكد من إعادة ضبط هذه المرحلة؟ سيتم حذف أسماء الأسر والدرجات لهذه المرحلة فقط."
        confirmLabel="نعم، إعادة الضبط"
        onConfirm={confirmReset}
        onCancel={closeResetDialog}
      />

      <ConfirmDialog
        isOpen={pendingFamilyCount !== null}
        title="تقليل عدد الأسر؟"
        description={`سيتم حذف آخر ${(
          stage.families.length - (pendingFamilyCount ?? stage.families.length)
        ).toLocaleString('ar-SA')} من الأسر مع أسمائها ودرجاتها. هل تريد المتابعة؟`}
        confirmLabel="نعم، تقليل العدد"
        tone="warning"
        onConfirm={confirmFamilyCount}
        onCancel={closeFamilyCountDialog}
      />

      <ConfirmDialog
        isOpen={previewWarning !== null}
        title="تنبيه قبل العرض"
        description={previewWarning ?? ''}
        confirmLabel="المتابعة إلى العرض"
        tone="warning"
        onConfirm={continueToPreview}
        onCancel={closePreviewWarning}
      />
    </PageTransition>
  )
}
