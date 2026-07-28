const DB_NAME = "leaguehub-db";
const DB_VERSION = 1;

let dbInstance = null;

// TODO: This needs further refactor, but it works now
// Creates the indexedDB api for the application
export function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("leagues")) {
        const leagues = db.createObjectStore("leagues", { keyPath: "id", autoIncrement: true });
        leagues.createIndex("name", "name", { unique: true });
        leagues.createIndex("isActive", "isActive", { unique: false });
      }

      if (!db.objectStoreNames.contains("teams")) {
        const teams = db.createObjectStore("teams", { keyPath: "id", autoIncrement: true });
        teams.createIndex("leagueId", "leagueId", { unique: false });
        teams.createIndex("name", "name", { unique: false });
      }

      if (!db.objectStoreNames.contains("players")) {
        const players = db.createObjectStore("players", { keyPath: "id", autoIncrement: true });
        players.createIndex("teamId", "teamId", { unique: false });
        players.createIndex("name", "name", { unique: false });
      }

      if (!db.objectStoreNames.contains("matches")) {
        const matches = db.createObjectStore("matches", { keyPath: "id", autoIncrement: true });
        matches.createIndex("leagueId", "leagueId", { unique: false });
        matches.createIndex("homeTeamId", "homeTeamId", { unique: false });
        matches.createIndex("awayTeamId", "awayTeamId", { unique: false });
        matches.createIndex("date", "date", { unique: false });
        matches.createIndex("status", "status", { unique: false });
      }

      if (!db.objectStoreNames.contains("events")) {
        const events = db.createObjectStore("events", { keyPath: "id", autoIncrement: true });
        events.createIndex("matchId", "matchId", { unique: false });
        events.createIndex("playerId", "playerId", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function getStore(mode, storeName) {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        resolve({ tx, store });
      })
      .catch(reject);
  });
}

export async function getAll(storeName) {
  const { store } = await getStore("readonly", storeName);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getById(storeName, id) {
  const { store } = await getStore("readonly", storeName);
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getByIndex(storeName, indexName, value) {
  const { store } = await getStore("readonly", storeName);
  const index = store.index(indexName);
  return new Promise((resolve, reject) => {
    const request = index.getAll(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function add(storeName, data) {
  const { store } = await getStore("readwrite", storeName);
  return new Promise((resolve, reject) => {
    const request = store.add(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function put(storeName, data) {
  const { store } = await getStore("readwrite", storeName);
  return new Promise((resolve, reject) => {
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function remove(storeName, id) {
  const { store } = await getStore("readwrite", storeName);
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clear(storeName) {
  const { store } = await getStore("readwrite", storeName);
  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function runTransaction(storeNames, mode, callback) {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const tx = db.transaction(storeNames, mode);
        const stores = {};
        storeNames.forEach((name) => {
          stores[name] = tx.objectStore(name);
        });

        tx.oncomplete = () => resolve();
        tx.onerror = (event) => reject(event.target.error);
        tx.onabort = (event) => reject(event.target.error);

        callback(stores, tx);
      })
      .catch(reject);
  });
}

export function getActiveLeagueId() {
  return localStorage.getItem("leaguehub-active-league") || null;
}

export function setActiveLeagueId(id) {
  if (id) {
    localStorage.setItem("leaguehub-active-league", id);
  } else {
    localStorage.removeItem("leaguehub-active-league");
  }
}
