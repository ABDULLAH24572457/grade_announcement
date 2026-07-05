import type { RealtimeChannel } from '@supabase/supabase-js'

import type { CompetitionData } from '@/types/competition.types'
import { isCompetitionData } from '@/utils/competition-validation'

import { supabaseClient } from './supabase-client'

const CHANNEL_NAME = 'competition-snapshot-main-changes'
const SNAPSHOT_FILTER = 'slug=eq.main'
const SNAPSHOTS_TABLE = 'competition_snapshots'

export type CompetitionRealtimeStatus =
  | 'connecting'
  | 'connected'
  | 'error'
  | 'closed'

interface CompetitionRealtimeHandlers {
  onData: (data: CompetitionData) => void
  onStatus: (status: CompetitionRealtimeStatus) => void
}

const readCompetitionData = (row: unknown): CompetitionData | null => {
  if (!row || typeof row !== 'object' || !('data' in row)) {
    return null
  }

  const data = (row as { data: unknown }).data
  return isCompetitionData(data) ? data : null
}

class CompetitionRealtimeService {
  private channel: RealtimeChannel | null = null

  subscribe({
    onData,
    onStatus,
  }: CompetitionRealtimeHandlers): () => void {
    const client = supabaseClient

    if (!client) {
      onStatus('error')
      return () => undefined
    }

    if (this.channel) {
      return () => undefined
    }

    onStatus('connecting')

    const handleChange = (row: unknown) => {
      const competitionData = readCompetitionData(row)

      if (competitionData) {
        onData(competitionData)
      }
    }

    const channel = client
      .channel(CHANNEL_NAME)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: SNAPSHOTS_TABLE,
          filter: SNAPSHOT_FILTER,
        },
        (payload) => handleChange(payload.new),
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: SNAPSHOTS_TABLE,
          filter: SNAPSHOT_FILTER,
        },
        (payload) => handleChange(payload.new),
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          onStatus('connected')
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          onStatus('error')
        } else if (status === 'CLOSED') {
          onStatus('closed')
        }
      })

    this.channel = channel

    return () => {
      if (this.channel === channel) {
        this.channel = null
      }

      onStatus('closed')
      void client.removeChannel(channel)
    }
  }
}

export const competitionRealtimeService =
  new CompetitionRealtimeService()
