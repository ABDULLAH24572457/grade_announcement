import { PageTransition } from '@/components/common/PageTransition'
import { ActionLink } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'

export const NotFoundPage = () => {
  useDocumentTitle('الصفحة غير موجودة')

  return (
    <PageTransition className="page-container grid min-h-[70vh] place-items-center py-16 text-center">
      <div>
        <p className="text-7xl font-bold text-brand-300/30">٤٠٤</p>
        <h1 className="mt-4 text-3xl font-bold text-white">هذه الصفحة غير موجودة</h1>
        <p className="mt-3 text-slate-400">
          يبدو أن الرابط تغيّر أو أن الصفحة لم تعد متاحة.
        </p>
        <ActionLink to={ROUTES.home} className="mt-8">
          العودة إلى الرئيسية
        </ActionLink>
      </div>
    </PageTransition>
  )
}
