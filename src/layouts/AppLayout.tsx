import { AnimatePresence } from 'framer-motion'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { AppInitializer } from '@/components/common/AppInitializer'
import { BrandMark } from '@/components/common/BrandMark'
import { NAVIGATION_ITEMS } from '@/constants/app.constants'
import { cn } from '@/utils/cn'

export const AppLayout = () => {
  const location = useLocation()

  return (
    <AppInitializer>
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-radial-glow">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-brand-400/[0.06] blur-3xl sm:h-96 sm:w-96"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-accent/[0.035] blur-3xl sm:h-96 sm:w-96"
        />

        <header className="relative z-20 border-b border-white/[0.07] bg-canvas/70 backdrop-blur-xl">
          <div className="page-container flex min-h-16 items-center justify-between gap-4 sm:min-h-20">
            <BrandMark />
            <nav aria-label="التنقل الرئيسي">
              <ul className="flex items-center gap-1 sm:gap-2">
                {NAVIGATION_ITEMS.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-lg px-3 py-2 text-xs font-bold transition sm:px-4 sm:text-sm',
                          isActive
                            ? 'bg-white/[0.08] text-white'
                            : 'text-slate-400 hover:bg-white/[0.05] hover:text-white',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main className="relative z-10 flex flex-1">
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </main>

        <footer className="relative z-10 border-t border-white/[0.06] py-5">
          <div className="page-container flex flex-col items-center justify-between gap-2 text-center text-xs text-slate-500 sm:flex-row sm:text-right">
            <p>منصة مصممة للحظات الإعلان التي تستحق التألق.</p>
            <p>جاهزة لكل شاشة، من الهاتف إلى مسرح الحدث.</p>
          </div>
        </footer>
      </div>
    </AppInitializer>
  )
}
