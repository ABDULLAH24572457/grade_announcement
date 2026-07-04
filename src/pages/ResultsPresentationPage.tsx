import { PageTransition } from '@/components/common/PageTransition'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { ActionLink, Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  MODE_OPTIONS,
  STAGE_OPTIONS,
} from '@/constants/app.constants'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useAppStore } from '@/store/app.store'

export const ResultsPresentationPage = () => {
  useDocumentTitle('عرض النتائج')
  const selectedStage = useAppStore((state) => state.selectedStage)
  const selectedMode = useAppStore((state) => state.selectedMode)
  const eventDraft = useAppStore((state) => state.eventDraft)

  const stageLabel =
    STAGE_OPTIONS.find((option) => option.id === selectedStage)?.title ??
    'مرحلة المنافسة'
  const modeLabel =
    MODE_OPTIONS.find((option) => option.id === selectedMode)?.title ??
    'نمط العرض'

  const enterFullscreen = () => {
    void document.documentElement.requestFullscreen?.()
  }

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold text-brand-300">الخطوة الرابعة</p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            معاينة شاشة العرض
          </h1>
        </div>
        <Button variant="secondary" onClick={enterFullscreen}>
          ملء الشاشة
        </Button>
      </div>

      <Card className="relative grid min-h-[58vh] place-items-center overflow-hidden border-brand-300/15 bg-gradient-to-b from-white/[0.055] to-white/[0.02] text-center sm:min-h-[62vh] lg:min-h-[65vh]">
        <div
          aria-hidden="true"
          className="absolute inset-x-[15%] top-0 h-40 rounded-full bg-brand-400/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl px-2 py-12">
          <span className="inline-flex rounded-full border border-brand-300/20 bg-brand-300/[0.07] px-4 py-2 text-xs font-bold text-brand-200 sm:text-sm">
            {stageLabel} · {modeLabel}
          </span>
          <p className="mt-8 text-sm text-slate-400 sm:text-base">
            {eventDraft.category || 'فئة المنافسة'}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-white sm:text-5xl lg:text-6xl">
            {eventDraft.title || 'عنوان الفعالية'}
          </h2>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-white/15 bg-canvas/35 px-6 py-10 sm:mt-14">
            <p className="font-bold text-slate-200">مساحة النتائج جاهزة</p>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              ستظهر هنا بيانات المشاركين والدرجات عند إضافة منطق النتائج.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <ActionLink to={ROUTES.setup} variant="ghost">
          <ArrowIcon direction="back" />
          العودة إلى الإعداد
        </ActionLink>
      </div>
    </PageTransition>
  )
}
