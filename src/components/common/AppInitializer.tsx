import { useEffect, type ReactNode } from 'react'

import { useAppStore } from '@/store/app.store'

interface AppInitializerProps {
  children: ReactNode
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  const hydrationStatus = useAppStore((state) => state.hydrationStatus)
  const initialize = useAppStore((state) => state.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (hydrationStatus === 'idle' || hydrationStatus === 'loading') {
    return (
      <main className="grid min-h-screen place-items-center bg-canvas px-4">
        <div className="text-center" role="status" aria-live="polite">
          <span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand-300" />
          <p className="text-sm text-slate-300">جارٍ تجهيز المنصة...</p>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
