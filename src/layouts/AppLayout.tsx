import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import { AppInitializer } from '@/components/common/AppInitializer'
import { BrandMark } from '@/components/common/BrandMark'
import { PersistenceStatus } from '@/components/common/PersistenceStatus'
import { ROUTES } from '@/constants/routes.constants'

export const AppLayout = () => {
  const location = useLocation()
  const isResultsPage = location.pathname === ROUTES.results

  return (
    <AppInitializer>
      <div className="flex min-h-screen flex-col bg-canvas bg-radial-glow">
        {!isResultsPage && (
          <header className="border-b border-white/[0.07] bg-canvas/80 backdrop-blur-lg">
            <div className="page-container flex min-h-16 flex-wrap items-center justify-between gap-2 py-2 sm:min-h-20 sm:flex-nowrap sm:gap-3 sm:py-0">
              <BrandMark />
              <PersistenceStatus className="max-w-[58%] sm:max-w-full" />
            </div>
          </header>
        )}

        <main className="flex flex-1">
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </main>
      </div>
    </AppInitializer>
  )
}
