import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { ActionLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import {
  MODE_OPTIONS,
  STAGE_OPTIONS,
} from '@/constants/app.constants'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useAppStore } from '@/store/app.store'

export const ResultsSetupPage = () => {
  useDocumentTitle('إعداد النتائج')
  const selectedStage = useAppStore((state) => state.selectedStage)
  const selectedMode = useAppStore((state) => state.selectedMode)
  const eventDraft = useAppStore((state) => state.eventDraft)
  const updateEventDraft = useAppStore((state) => state.updateEventDraft)

  const stageLabel =
    STAGE_OPTIONS.find((option) => option.id === selectedStage)?.title ??
    'غير محددة'
  const modeLabel =
    MODE_OPTIONS.find((option) => option.id === selectedMode)?.title ??
    'غير محدد'

  return (
    <PageTransition>
      <PageHeader
        eyebrow="الخطوة الثالثة"
        title="لنجهّز شاشة النتائج"
        description="أضف المعلومات الأساسية التي ستعرّف الجمهور بالحدث. ستتوفر حقول النتائج التفصيلية في المرحلة التالية من التطوير."
      />

      <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[1fr_0.48fr]">
        <Card>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              name="eventTitle"
              label="اسم الفعالية"
              placeholder="مثال: مسابقة الإبداع السنوية"
              value={eventDraft.title}
              onChange={(event) =>
                updateEventDraft({ title: event.target.value })
              }
            />
            <Input
              name="eventCategory"
              label="الفئة أو المسار"
              placeholder="مثال: فئة المرحلة الثانوية"
              value={eventDraft.category}
              onChange={(event) =>
                updateEventDraft({ category: event.target.value })
              }
            />
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-white/[0.025] p-5 text-center">
            <p className="text-sm font-bold text-slate-300">
              إعداد المشاركين والدرجات
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              سيُضاف في مرحلة بناء منطق النتائج، مع الحفاظ على هذه البنية كما هي.
            </p>
          </div>
        </Card>

        <Card className="h-fit">
          <p className="mb-5 text-sm font-bold text-white">ملخص الاختيارات</p>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs text-slate-500">مرحلة المنافسة</dt>
              <dd className="mt-1 font-bold text-slate-200">{stageLabel}</dd>
            </div>
            <div className="border-t border-white/[0.07] pt-4">
              <dt className="text-xs text-slate-500">نمط العرض</dt>
              <dd className="mt-1 font-bold text-slate-200">{modeLabel}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl flex-col-reverse justify-between gap-3 sm:mt-10 sm:flex-row">
        <ActionLink to={ROUTES.modes} variant="ghost" size="lg">
          <ArrowIcon direction="back" />
          العودة إلى النمط
        </ActionLink>
        <ActionLink to={ROUTES.presentation} size="lg">
          معاينة شاشة العرض
        </ActionLink>
      </div>
    </PageTransition>
  )
}
