import { Link, Navigate } from 'react-router-dom'

import { PageTransition } from '@/components/common/PageTransition'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useAppStore } from '@/store/app.store'

const actions = [
  {
    title: 'عرض النتائج',
    description: 'افتح شاشة النتائج وابدأ كشف الدرجات.',
    path: ROUTES.results,
  },
  {
    title: 'إعداد النتائج',
    description: 'عدّل أسماء الأسر والدرجات قبل العرض.',
    path: ROUTES.setup,
  },
]

export const StageActionsPage = () => {
  useDocumentTitle('اختيار الإجراء')
  const selectedStage = useAppStore((state) => state.selectedStage)
  const stage = useAppStore((state) =>
    state.selectedStage
      ? state.competitionData.stages[state.selectedStage]
      : undefined,
  )

  if (!selectedStage || !stage) {
    return <Navigate to={ROUTES.home} replace />
  }

  return (
    <PageTransition className="page-container flex w-full items-center py-10 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-sm font-bold text-brand-200">مرحلة {stage.label}</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-5xl">
            ماذا تريد أن تفعل؟
          </h1>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {actions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] p-6 text-center transition hover:border-brand-300/40 hover:bg-brand-300/[0.07] sm:min-h-56 sm:rounded-3xl"
            >
              <span className="text-2xl font-bold text-white sm:text-3xl">
                {action.title}
              </span>
              <span className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
