import { motion, useReducedMotion } from 'framer-motion'

import { PageTransition } from '@/components/common/PageTransition'
import { ActionLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'

const highlights = [
  {
    number: '١',
    title: 'اختر المرحلة',
    description: 'حدد موضع المنافسة في رحلتها.',
  },
  {
    number: '٢',
    title: 'جهّز العرض',
    description: 'اختر النمط وأضف تفاصيل الحدث.',
  },
  {
    number: '٣',
    title: 'ابدأ اللحظة',
    description: 'اعرض النتائج بوضوح وثقة.',
  },
]

export const HomePage = () => {
  useDocumentTitle()
  const reduceMotion = useReducedMotion()

  return (
    <PageTransition className="page-container flex w-full items-center py-12 sm:py-16 lg:py-24">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <section className="text-center lg:text-right">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-300/20 bg-brand-300/[0.07] px-4 py-2 text-xs font-bold text-brand-200 sm:text-sm"
          >
            <span className="h-2 w-2 rounded-full bg-brand-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]" />
            تجربة عرض صُممت للفعاليات المباشرة
          </motion.div>

          <h1 className="text-balance text-4xl font-bold leading-[1.25] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            اجعل إعلان النتائج
            <span className="mt-1 block bg-gradient-to-l from-brand-200 to-brand-400 bg-clip-text text-transparent">
              لحظة لا تُنسى
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-300 sm:text-lg lg:mx-0 lg:text-xl lg:leading-9">
            منصة أنيقة وسريعة لتقديم نتائج المسابقات على الشاشات الكبيرة،
            بوضوح يليق بالمشاركين والجمهور.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <ActionLink to={ROUTES.stages} size="lg">
              ابدأ إعداد العرض
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
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </ActionLink>
            <a
              href="#overview"
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-7 text-base font-bold text-slate-200 transition hover:bg-white/[0.08]"
            >
              اكتشف التجربة
            </a>
          </div>
        </section>

        <Card
          id="overview"
          className="relative overflow-hidden border-brand-300/10 p-4 sm:p-6"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand-300/70 to-transparent" />
          <div className="rounded-2xl border border-white/10 bg-canvas/70 p-5 sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">المسابقة السنوية</p>
                <p className="mt-1 font-bold text-white">النتائج النهائية</p>
              </div>
              <span className="rounded-full bg-brand-300/10 px-3 py-1 text-xs font-bold text-brand-200">
                مباشر
              </span>
            </div>

            <div className="space-y-3">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.2 + index * 0.1,
                  }}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.035] p-4"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] font-bold text-brand-200">
                    {item.number}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white sm:text-base">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  )
}
