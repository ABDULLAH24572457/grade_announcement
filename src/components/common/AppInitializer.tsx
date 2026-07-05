import { useEffect, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { useCompetitionRealtime } from '@/hooks/use-competition-realtime'
import { useAppStore } from '@/store/app.store'

interface AppInitializerProps {
  children: ReactNode
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  useCompetitionRealtime()
  const hydrationStatus = useAppStore((state) => state.hydrationStatus)
  const initialize = useAppStore((state) => state.initialize)
  const retryInitialize = useAppStore((state) => state.retryInitialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (hydrationStatus === 'idle' || hydrationStatus === 'loading') {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas px-4">
        <div className="text-center" role="status" aria-live="polite">
          <span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand-300" />
          <p className="text-sm text-slate-300">جاري تحميل البيانات...</p>
        </div>
      </main>
    )
  }

  if (hydrationStatus === 'error') {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas px-4">
        <div
          className="w-full max-w-sm text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-red-300/20 bg-red-300/[0.08] text-red-200">
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">
            تعذر تحميل البيانات
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            تحقق من الاتصال ثم حاول مرة أخرى.
          </p>
          <Button
            size="lg"
            className="mt-6"
            onClick={() => void retryInitialize()}
          >
            إعادة المحاولة
          </Button>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
