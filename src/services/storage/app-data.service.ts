import { LocalStorageAppDataService } from './local-storage.service'

// Local app snapshots remain active as the primary local mode, the Supabase
// fallback cache, and storage for device-only selections.
export const appDataService = new LocalStorageAppDataService()
