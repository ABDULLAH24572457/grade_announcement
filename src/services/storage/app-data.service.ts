import { LocalStorageAppDataService } from './local-storage.service'

// This composition point is the only implementation reference that needs to
// change when the application moves to a remote persistence provider.
export const appDataService = new LocalStorageAppDataService()
