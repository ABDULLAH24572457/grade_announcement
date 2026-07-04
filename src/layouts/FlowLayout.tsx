import { Outlet } from 'react-router-dom'

import { FlowSteps } from '@/components/common/FlowSteps'

export const FlowLayout = () => (
  <div className="page-container w-full py-8 sm:py-12 lg:py-16">
    <FlowSteps />
    <Outlet />
  </div>
)
