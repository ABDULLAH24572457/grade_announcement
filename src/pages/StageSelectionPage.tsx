import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { SelectionCard } from '@/components/selection/SelectionCard'
import { ActionLink, Button } from '@/components/ui/Button'
import { STAGE_OPTIONS } from '@/constants/app.constants'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useAppStore } from '@/store/app.store'

export const StageSelectionPage = () => {
  useDocumentTitle('اختيار المرحلة')
  const selectedStage = useAppStore((state) => state.selectedStage)
  const setStage = useAppStore((state) => state.setStage)

  return (
    <PageTransition>
      <PageHeader
        eyebrow="الخطوة الأولى"
        title="ما مرحلة المنافسة؟"
        description="اختر المرحلة التي تريد تقديم نتائجها الآن. يمكنك العودة وتغييرها في أي وقت."
      />

      <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
        {STAGE_OPTIONS.map((option) => (
          <SelectionCard
            key={option.id}
            option={option}
            selected={selectedStage === option.id}
            onSelect={setStage}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end sm:mt-10">
        {selectedStage ? (
          <ActionLink to={ROUTES.modes} size="lg" fullWidth className="sm:w-auto">
            متابعة إلى نمط العرض
          </ActionLink>
        ) : (
          <Button size="lg" fullWidth className="sm:w-auto" disabled>
            اختر مرحلة للمتابعة
          </Button>
        )}
      </div>
    </PageTransition>
  )
}
