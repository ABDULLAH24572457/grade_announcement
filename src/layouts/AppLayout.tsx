import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import { AppInitializer } from '@/components/common/AppInitializer'
import { BrandMark } from '@/components/common/BrandMark'
import { ROUTES } from '@/constants/routes.constants'

export const AppLayout = () => {
  const location = useLocation()
  const isResultsPage = location.pathname === ROUTES.results

  return (
    <AppInitializer>
      <div className="flex min-h-screen flex-col bg-canvas bg-radial-glow">
        {!isResultsPage && (
          <header className="border-b border-white/[0.07] bg-canvas/80 backdrop-blur-lg">
            <div className="page-container flex min-h-16 items-center sm:min-h-20">
              <BrandMark />
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
