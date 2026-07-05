import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/layouts/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ResultsPage } from '@/pages/ResultsPage'
import { ResultsSetupPage } from '@/pages/ResultsSetupPage'
import { StageActionsPage } from '@/pages/StageActionsPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'actions',
        element: <StageActionsPage />,
      },
      {
        path: 'setup',
        element: <ResultsSetupPage />,
      },
      {
        path: 'results',
        element: <ResultsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
