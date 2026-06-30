/**
 * sync.js — pulls course updates from GitHub for logged-in users only.
 * Guest mode / offline users never call this; they just read from IndexedDB.
 *
 * Expects, in your public GitHub repo:
 *   courses-index.json   <- list of all courses + a version stamp each
 *   courses/<id>/course.json
 *   courses/<id>/lessons/<lessonId>.json
 *
 * courses-index.json shape:
 * {
 *   "courses": [
 *     { "id": "html-basics", "version": "2026-07-01T00:00:00Z" }
 *   ]
 * }
 *
 * "version" can be anything that changes when content changes — an ISO
 * timestamp, a number, a git commit hash. We just compare strings.
 */

// 👉 EDIT THESE TWO LINES to point at your repo
const GITHUB_USER = "PASTE_YOUR_GITHUB_USERNAME";
const GITHUB_REPO = "PASTE_YOUR_REPO_NAME";
const GITHUB_BRANCH = "main";

const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

async function fetchJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}): ${url}`);
  return res.json();
}

const Sync = {
  /**
   * Returns { updated: [courseId, ...], errors: [...] }
   */
  async syncFromGitHub(onProgress) {
    const result = { updated: [], errors: [] };
    let index;
    try {
      index = await fetchJSON(`${RAW_BASE}/courses-index.json`);
    } catch (err) {
      result.errors.push(`Could not reach GitHub index: ${err.message}`);
      return result; // offline or repo not reachable — caller should fall back silently
    }

    for (const entry of index.courses || []) {
      try {
        const localVersionKey = `course_version_${entry.id}`;
        const localVersion = await DB.getMeta(localVersionKey);
        if (localVersion === entry.version) continue; // already up to date

        onProgress && onProgress(`Updating ${entry.id}...`);

        const course = await fetchJSON(`${RAW_BASE}/courses/${entry.id}/course.json`);
        await DB.putCourse(course);

        for (const lessonId of course.lessons) {
          const lesson = await fetchJSON(`${RAW_BASE}/courses/${entry.id}/lessons/${lessonId}.json`);
          await DB.putLesson(entry.id, lesson);
        }

        await DB.setMeta(localVersionKey, entry.version);
        result.updated.push(entry.id);
      } catch (err) {
        result.errors.push(`${entry.id}: ${err.message}`);
      }
    }
    return result;
  },
};
