/**
 * db.js — thin IndexedDB wrapper.
 * Stores: courses, lessons, meta (sync versions), progress
 */
const DB_NAME = "learning-app-db";
const DB_VERSION = 1;
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("courses")) {
        db.createObjectStore("courses", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("lessons")) {
        // keyed by `${courseId}__${lessonId}`
        db.createObjectStore("lessons", { keyPath: "_key" });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("progress")) {
        db.createObjectStore("progress", { keyPath: "_key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx(storeName, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(storeName, mode);
    const store = t.objectStore(storeName);
    const result = fn(store);
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
  });
}

const DB = {
  async putCourse(course) {
    return tx("courses", "readwrite", (s) => s.put(course));
  },
  async getAllCourses() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction("courses", "readonly").objectStore("courses").getAll();
      req.onsuccess = () => resolve(req.result.sort((a, b) => a.order - b.order));
      req.onerror = () => reject(req.error);
    });
  },
  async getCourse(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction("courses", "readonly").objectStore("courses").get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async putLesson(courseId, lesson) {
    const record = { ...lesson, _key: `${courseId}__${lesson.id}`, _courseId: courseId };
    return tx("lessons", "readwrite", (s) => s.put(record));
  },
  async getLesson(courseId, lessonId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction("lessons", "readonly").objectStore("lessons").get(`${courseId}__${lessonId}`);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async getMeta(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction("meta", "readonly").objectStore("meta").get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => reject(req.error);
    });
  },
  async setMeta(key, value) {
    return tx("meta", "readwrite", (s) => s.put({ key, value }));
  },
  async setProgress(courseId, lessonId, done) {
    const record = { _key: `${courseId}__${lessonId}`, courseId, lessonId, done, updatedAt: Date.now() };
    return tx("progress", "readwrite", (s) => s.put(record));
  },
  async getProgressForCourse(courseId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction("progress", "readonly").objectStore("progress").getAll();
      req.onsuccess = () => resolve(req.result.filter((p) => p.courseId === courseId));
      req.onerror = () => reject(req.error);
    });
  },
};
