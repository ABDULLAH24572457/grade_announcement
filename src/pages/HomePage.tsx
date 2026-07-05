import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { PageTransition } from '@/components/common/PageTransition'
import { STAGE_OPTIONS } from '@/constants/app.constants'
import { ROUTES } from '@/constants/routes.constants'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useAppStore } from '@/store/app.store'

export const HomePage = () => {
  useDocumentTitle()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const selectStage = useAppStore((state) => state.selectStage)

  return (
    <PageTransition className="page-container flex w-full items-center py-10 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center sm:mb-10">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">
            اختر المرحلة
          </h1>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            اختر المرحلة التي تريد العمل عليها.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {STAGE_OPTIONS.map((stage, index) => (
            <motion.button
              key={stage.id}
              type="button"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduceMotion ? 0 : index * 0.08,
                duration: 0.25,
              }}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              onClick={() => {
                selectStage(stage.id)
                navigate(ROUTES.actions)
              }}
              className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] p-6 text-center transition hover:border-brand-300/40 hover:bg-brand-300/[0.07] sm:min-h-56 sm:rounded-3xl"
            >
              <span className="text-4xl font-bold text-white sm:text-5xl">
                {stage.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
