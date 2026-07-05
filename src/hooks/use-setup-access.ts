import { useCallback, useState } from 'react'

const SETUP_ACCESS_SESSION_KEY = 'competition-results-setup-unlocked'
const configuredPasscode = import.meta.env.VITE_SETUP_PASSCODE ?? ''
const isProtectionEnabled = configuredPasscode.length > 0

const readSessionAccess = (): boolean => {
  if (!isProtectionEnabled) {
    return true
  }

  try {
    return sessionStorage.getItem(SETUP_ACCESS_SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

export const useSetupAccess = () => {
  const [isUnlocked, setIsUnlocked] = useState(readSessionAccess)

  const unlock = useCallback((passcode: string): boolean => {
    if (!isProtectionEnabled || passcode === configuredPasscode) {
      setIsUnlocked(true)

      try {
        sessionStorage.setItem(SETUP_ACCESS_SESSION_KEY, 'true')
      } catch {
        // In-memory access still works when sessionStorage is unavailable.
      }

      return true
    }

    return false
  }, [])

  const lock = useCallback(() => {
    try {
      sessionStorage.removeItem(SETUP_ACCESS_SESSION_KEY)
    } catch {
      // The in-memory state is enough to lock the current page.
    }

    setIsUnlocked(!isProtectionEnabled)
  }, [])

  /*
   * This is not a strong security boundary. Vite environment variables are
   * included in the browser bundle, and sessionStorage can be modified by the
   * user. This gate only prevents casual or accidental edits. Use Supabase
   * Auth and restrictive RLS policies for real authorization.
   */
  return {
    isProtectionEnabled,
    isUnlocked,
    unlock,
    lock,
  }
}
