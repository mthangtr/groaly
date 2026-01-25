import { openDB, type IDBPDatabase } from "idb"
import type { Json } from "@/types/database"

const DB_NAME = "dumtasking-offline"
const DB_VERSION = 1

export type SyncOperation = "create" | "update" | "delete"

export type NoteSyncQueueItem = {
  id: string
  operation: SyncOperation
  data: {
    id?: string
    title?: string
    content?: Json
    metadata?: Json | null
    user_id?: string
  }
  timestamp: number
  retries: number
}

export type TaskSyncQueueItem = {
  id: string
  operation: SyncOperation
  data: {
    id?: string
    title?: string
    description?: string
    status?: string
    user_id?: string
  }
  timestamp: number
  retries: number
}

type DumtaskingDB = {
  notes_queue: {
    key: string
    value: NoteSyncQueueItem
    indexes: { timestamp: number }
  }
  tasks_queue: {
    key: string
    value: TaskSyncQueueItem
    indexes: { timestamp: number }
  }
}

let dbInstance: IDBPDatabase<DumtaskingDB> | null = null

export async function getDB(): Promise<IDBPDatabase<DumtaskingDB>> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<DumtaskingDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Notes sync queue
      if (!db.objectStoreNames.contains("notes_queue")) {
        const notesStore = db.createObjectStore("notes_queue", {
          keyPath: "id",
        })
        notesStore.createIndex("timestamp", "timestamp")
      }

      // Tasks sync queue
      if (!db.objectStoreNames.contains("tasks_queue")) {
        const tasksStore = db.createObjectStore("tasks_queue", {
          keyPath: "id",
        })
        tasksStore.createIndex("timestamp", "timestamp")
      }
    },
  })

  return dbInstance
}

export async function closeDB(): Promise<void> {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

// Notes queue operations
export async function addNoteToQueue(
  operation: SyncOperation,
  data: NoteSyncQueueItem["data"]
): Promise<string> {
  const db = await getDB()
  const queueId = `${operation}-${data.id || Date.now()}-${Date.now()}`

  const item: NoteSyncQueueItem = {
    id: queueId,
    operation,
    data,
    timestamp: Date.now(),
    retries: 0,
  }

  await db.add("notes_queue", item)
  return queueId
}

export async function getNotesQueue(): Promise<NoteSyncQueueItem[]> {
  const db = await getDB()
  return db.getAllFromIndex("notes_queue", "timestamp")
}

export async function removeNoteFromQueue(queueId: string): Promise<void> {
  const db = await getDB()
  await db.delete("notes_queue", queueId)
}

export async function updateNoteQueueRetries(
  queueId: string,
  retries: number
): Promise<void> {
  const db = await getDB()
  const item = await db.get("notes_queue", queueId)
  if (item) {
    item.retries = retries
    await db.put("notes_queue", item)
  }
}

export async function clearNotesQueue(): Promise<void> {
  const db = await getDB()
  await db.clear("notes_queue")
}

// Tasks queue operations
export async function addTaskToQueue(
  operation: SyncOperation,
  data: TaskSyncQueueItem["data"]
): Promise<string> {
  const db = await getDB()
  const queueId = `${operation}-${data.id || Date.now()}-${Date.now()}`

  const item: TaskSyncQueueItem = {
    id: queueId,
    operation,
    data,
    timestamp: Date.now(),
    retries: 0,
  }

  await db.add("tasks_queue", item)
  return queueId
}

export async function getTasksQueue(): Promise<TaskSyncQueueItem[]> {
  const db = await getDB()
  return db.getAllFromIndex("tasks_queue", "timestamp")
}

export async function removeTaskFromQueue(queueId: string): Promise<void> {
  const db = await getDB()
  await db.delete("tasks_queue", queueId)
}

export async function updateTaskQueueRetries(
  queueId: string,
  retries: number
): Promise<void> {
  const db = await getDB()
  const item = await db.get("tasks_queue", queueId)
  if (item) {
    item.retries = retries
    await db.put("tasks_queue", item)
  }
}

export async function clearTasksQueue(): Promise<void> {
  const db = await getDB()
  await db.clear("tasks_queue")
}

export async function getQueueStats(): Promise<{
  notesCount: number
  tasksCount: number
  totalCount: number
}> {
  const db = await getDB()
  const notesCount = await db.count("notes_queue")
  const tasksCount = await db.count("tasks_queue")

  return {
    notesCount,
    tasksCount,
    totalCount: notesCount + tasksCount,
  }
}
