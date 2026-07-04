import type { PersistedAppData } from '@/types/app.types'

export interface AppDataService {
  load(): Promise<PersistedAppData | null>
  save(data: PersistedAppData): Promise<void>
  clear(): Promise<void>
}
