# Offline Mode Implementation

## Overview

This feature implements offline-first note editing with automatic sync queue using IndexedDB. Users can continue working seamlessly when offline, and all changes will automatically sync when connection is restored.

## Architecture

### Components

1. **IndexedDB Layer** (`lib/offline/idb.ts`)
   - Database: `dumtasking-offline`
   - Tables:
     - `notes_queue`: Queued note operations (create, update, delete)
     - `tasks_queue`: Queued task operations (for future use)
   - Each queue item tracks: operation type, data, timestamp, and retry count

2. **Sync Queue Manager** (`lib/offline/sync-queue.ts`)
   - Handles background sync when online
   - Retry mechanism (max 3 retries with 1s delay)
   - Status notifications to UI
   - Auto-sync triggers:
     - When connection restored (online event)
     - Every 5 minutes if online

3. **React Hook** (`hooks/useOfflineSync.ts`)
   - Provides offline-aware CRUD operations
   - Monitors online/offline status
   - Tracks sync status and queued items count
   - Automatic fallback: tries API first, falls back to queue if offline

4. **UI Indicator** (`components/common/OfflineIndicator.tsx`)
   - Real-time sync status badge
   - Shows: offline, syncing (with progress), pending changes, synced
   - Manual sync trigger button
   - Integrated in sidebar

## Usage

### In Note Editor

```typescript
import { useOfflineSync } from "@/hooks/useOfflineSync"

const { updateNoteOffline, isOnline } = useOfflineSync()

// Save changes (works online or offline)
await updateNoteOffline(noteId, { title, content })
```

### User Experience

- **Offline editing**: Notes save instantly to IndexedDB
- **Visual feedback**: 
  - Orange badge when offline
  - Blue animated badge when syncing
  - Yellow badge when changes pending
  - Green badge when all synced
- **Toast notifications**:
  - "You're offline. Changes will sync when reconnected."
  - "Connection restored. Syncing..."
  - "Synced X items" (on success)
- **Automatic sync**: No manual intervention needed

## Testing

### Test Offline Mode

1. Open DevTools → Network tab
2. Set network throttling to "Offline"
3. Edit a note → Changes save locally
4. Check sidebar: offline indicator shows orange badge
5. Restore network → Auto-sync triggers
6. Check sidebar: badge turns green when synced

### Test Sync Queue

1. Go offline
2. Create/edit multiple notes
3. Offline indicator shows pending count (e.g., "3 pending")
4. Click indicator → tooltip shows "Sync now" button
5. Go online
6. Automatic sync processes all queued changes
7. Toast shows "Synced 3 items"

## Database Schema

### notes_queue

```typescript
{
  id: string              // Queue item ID (format: "operation-noteId-timestamp")
  operation: "create" | "update" | "delete"
  data: {
    id?: string          // Note ID
    title?: string       // Note title
    content?: Json       // Tiptap JSON content
    metadata?: Json      // Note metadata
    user_id?: string     // User ID
  }
  timestamp: number      // Unix timestamp
  retries: number        // Retry count (max 3)
}
```

## Conflict Resolution

Current strategy: **Last-write-wins**
- Offline changes always take precedence
- No conflict UI needed (future enhancement)
- Server version is overwritten on sync

## Future Enhancements

1. **Conflict detection UI**
   - Show diff when server version newer
   - User chooses: keep local, use server, or merge

2. **Task sync**
   - Currently queued but not integrated
   - Hook already has placeholder

3. **Periodic sync optimization**
   - Only sync if queue not empty
   - Exponential backoff on failures

4. **Offline assets**
   - Cache static assets via service worker
   - Full offline app experience

## Dependencies

- `idb@^8.0.3`: IndexedDB wrapper with Promise API
- Native APIs: `navigator.onLine`, `online`/`offline` events

## File Locations

```
lib/offline/
  ├── idb.ts           # IndexedDB operations
  └── sync-queue.ts    # Sync logic

hooks/
  └── useOfflineSync.ts # React hook

components/
  ├── common/
  │   └── OfflineIndicator.tsx # UI badge
  └── layout/
      └── app-sidebar.tsx      # Sidebar integration

app/(dashboard)/notes/[id]/
  └── page.tsx         # Note editor with offline support
```

## Acceptance Criteria ✓

- [x] IndexedDB database: dumtasking-offline
- [x] Tables: notes_queue, tasks_queue
- [x] Offline note editing with instant save
- [x] Offline indicator in UI
- [x] Queue syncs when reconnected
- [x] Background sync every 5 minutes
- [x] Conflict resolution (last-write-wins)
- [x] Sync status indicator
- [x] Clear queue after successful sync
- [x] Offline-first for note content (instant save)
