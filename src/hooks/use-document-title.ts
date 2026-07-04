import { useEffect } from 'react'

import { APP_NAME } from '@/constants/app.constants'

export const useDocumentTitle = (pageTitle?: string) => {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | ${APP_NAME}` : APP_NAME
  }, [pageTitle])
}
