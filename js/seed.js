/**
 * seed.js — loads bundled courses into IndexedDB on first run, so guest
 * mode works with zero network calls (once cached by the service worker).
 *
 * Reads the SAME courses-index.json file that GitHub sync uses (fetched
 * here as a relative/local path, so it works offline too once cached).
 * You never need to edit this file again — just keep courses-index.json
 * and the courses/ folder in sync.
 */
const Seed = {
  async seedIfNeeded() {
    const seeded = await DB.getMeta("bundled_seed_done");
    if (seeded) return;

    let index;
    try {
      index = await (await fetch("courses-index.json")).json();
    } catch (err) {
      console.error("Could not load courses-index.json for seeding", err);
      return;
    }

    for (const entry of index.courses || []) {
      try {
        const course = await (await fetch(`courses/${entry.id}/course.json`)).json();
        if (course.id !== entry.id) {
          console.warn(
            `Mismatch: courses-index.json says "${entry.id}" but course.json id is "${course.id}". ` +
            `These must match exactly (and match the folder name).`
          );
        }
        await DB.putCourse(course);
        for (const lessonId of course.lessons) {
          const lesson = await (await fetch(`courses/${entry.id}/lessons/${lessonId}.json`)).json();
          await DB.putLesson(entry.id, lesson);
        }
        await DB.setMeta(`course_version_${entry.id}`, entry.version || "bundled-v1");
      } catch (err) {
        console.error(`Seed failed for course "${entry.id}" — check that the folder name, `
          + `course.json "id", and lesson filenames all match exactly.`, err);
      }
    }
    await DB.setMeta("bundled_seed_done", true);
  },
};
