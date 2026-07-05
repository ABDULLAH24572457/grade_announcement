import { useCallback, useEffect, useState } from 'react'

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement),
  )
  const isFullscreenAvailable = Boolean(
    document.fullscreenEnabled &&
      document.documentElement.requestFullscreen,
  )

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const enterFullscreen = useCallback(async () => {
    if (!document.fullscreenEnabled || document.fullscreenElement) {
      return
    }

    try {
      await document.documentElement.requestFullscreen()
    } catch {
      // The browser or display environment can reject fullscreen requests.
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      return
    }

    try {
      await document.exitFullscreen()
    } catch {
      // Exiting fullscreen can fail when the browser has already handled it.
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await exitFullscreen()
    } else {
      await enterFullscreen()
    }
  }, [enterFullscreen, exitFullscreen])

  return {
    isFullscreen,
    isFullscreenAvailable,
    toggleFullscreen,
    exitFullscreen,
  }
}
