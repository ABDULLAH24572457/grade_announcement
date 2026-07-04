import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/layouts/AppLayout'
import { FlowLayout } from '@/layouts/FlowLayout'
import { HomePage } from '@/pages/HomePage'
import { ModeSelectionPage } from '@/pages/ModeSelectionPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ResultsPresentationPage } from '@/pages/ResultsPresentationPage'
import { ResultsSetupPage } from '@/pages/ResultsSetupPage'
import { StageSelectionPage } from '@/pages/StageSelectionPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <FlowLayout />,
        children: [
          {
            path: 'stages',
            element: <StageSelectionPage />,
          },
          {
            path: 'modes',
            element: <ModeSelectionPage />,
          },
          {
            path: 'setup',
            element: <ResultsSetupPage />,
          },
          {
            path: 'presentation',
            element: <ResultsPresentationPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
