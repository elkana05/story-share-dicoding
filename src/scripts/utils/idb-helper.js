import { openDB } from 'idb';

const DB_NAME = 'storyshare-db';
const DB_VERSION = 1;
const SAVED_STORE = 'saved-stories';
const PENDING_STORE = 'pending-stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(SAVED_STORE)) {
      const savedStore = db.createObjectStore(SAVED_STORE, { keyPath: 'id' });
      savedStore.createIndex('createdAt', 'createdAt');
      savedStore.createIndex('name', 'name');
    }
    if (!db.objectStoreNames.contains(PENDING_STORE)) {
      db.createObjectStore(PENDING_STORE, { keyPath: 'localId', autoIncrement: true });
    }
  },
});

// ─── Saved Stories ───────────────────────────────────────────────────────────

export async function saveStory(story) {
  const db = await dbPromise;
  return db.put(SAVED_STORE, story);
}

export async function getSavedStories() {
  const db = await dbPromise;
  return db.getAll(SAVED_STORE);
}

export async function getStoryById(id) {
  const db = await dbPromise;
  return db.get(SAVED_STORE, id);
}

export async function deleteSavedStory(id) {
  const db = await dbPromise;
  return db.delete(SAVED_STORE, id);
}

export async function isStorySaved(id) {
  const story = await getStoryById(id);
  return !!story;
}

// ─── Pending Stories (Offline Sync) ──────────────────────────────────────────

export async function addPendingStory(storyData) {
  const db = await dbPromise;
  return db.add(PENDING_STORE, {
    ...storyData,
    createdAt: new Date().toISOString(),
  });
}

export async function getPendingStories() {
  const db = await dbPromise;
  return db.getAll(PENDING_STORE);
}

export async function deletePendingStory(localId) {
  const db = await dbPromise;
  return db.delete(PENDING_STORE, localId);
}

export async function getPendingCount() {
  const db = await dbPromise;
  return db.count(PENDING_STORE);
}
