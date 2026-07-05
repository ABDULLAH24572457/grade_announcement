import { useEffect } from 'react'

import {
  competitionRealtimeService,
  type CompetitionRealtimeStatus,
} from '@/services/supabase/competition-realtime.service'
import { useAppStore } from '@/store/app.store'
import type { RealtimeSyncStatus } from '@/types/app.types'

const toStoreStatus = (
  status: CompetitionRealtimeStatus,
): RealtimeSyncStatus => {
  if (status === 'connected') {
    return 'connected'
  }

  if (status === 'connecting') {
    return 'connecting'
  }

  if (status === 'error') {
    return 'error'
  }

  return 'inactive'
}

export const useCompetitionRealtime = () => {
  const hydrationStatus = useAppStore((state) => state.hydrationStatus)
  const persistenceMode = useAppStore((state) => state.persistenceMode)
  const applyRemoteCompetitionData = useAppStore(
    (state) => state.applyRemoteCompetitionData,
  )
  const setRealtimeStatus = useAppStore(
    (state) => state.setRealtimeStatus,
  )

  useEffect(() => {
    if (
      hydrationStatus !== 'ready' ||
      persistenceMode !== 'supabase'
    ) {
      setRealtimeStatus('inactive')
      return
    }

    return competitionRealtimeService.subscribe({
      onData: applyRemoteCompetitionData,
      onStatus: (status) => setRealtimeStatus(toStoreStatus(status)),
    })
  }, [
    applyRemoteCompetitionData,
    hydrationStatus,
    persistenceMode,
    setRealtimeStatus,
  ])
}
