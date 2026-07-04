import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { SelectionCard } from '@/components/selection/SelectionCard'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { ActionLink, Button } from '@/components/ui/Button'
import { MODE_OPTIONS } from '@/constants/app.constants'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useAppStore } from '@/store/app.store'

export const ModeSelectionPage = () => {
  useDocumentTitle('اختيار نمط العرض')
  const selectedMode = useAppStore((state) => state.selectedMode)
  const setMode = useAppStore((state) => state.setMode)

  return (
    <PageTransition>
      <PageHeader
        eyebrow="الخطوة الثانية"
        title="كيف ستظهر النتائج؟"
        description="اختر التجربة البصرية الأنسب للحظة الإعلان وطبيعة المنافسة."
      />

      <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
        {MODE_OPTIONS.map((option) => (
          <SelectionCard
            key={option.id}
            option={option}
            selected={selectedMode === option.id}
            onSelect={setMode}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:mt-10 sm:flex-row">
        <ActionLink to={ROUTES.stages} variant="ghost" size="lg">
          <ArrowIcon direction="back" />
          العودة إلى المرحلة
        </ActionLink>
        {selectedMode ? (
          <ActionLink to={ROUTES.setup} size="lg">
            متابعة إلى الإعداد
          </ActionLink>
        ) : (
          <Button size="lg" disabled>
            اختر نمطًا للمتابعة
          </Button>
        )}
      </div>
    </PageTransition>
  )
}
