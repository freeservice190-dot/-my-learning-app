/**
 * render.js — turns DB data into DOM. Matches the lesson.schema.json /
 * course.schema.json content blocks: text, heading, code, image, tip, list.
 * Only the presentation (icons, badges, markup classes) changed from the
 * original — all data access and app logic is the same.
 */
const Render = {
  async courseList(container) {
    const courses = await DB.getAllCourses();
    container.innerHTML = "";
    if (courses.length === 0) {
      container.innerHTML = `<p class="empty-state">No courses yet. Connect and sign in to sync, or check your bundled content.</p>`;
      return;
    }
    for (const course of courses) {
      const progress = await DB.getProgressForCourse(course.id);
      const doneCount = progress.filter((p) => p.done).length;
      const pct = course.lessons.length ? (doneCount / course.lessons.length) * 100 : 0;
      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        <div class="course-card-top">
          <span class="course-icon-badge">${course.icon || "📘"}</span>
          ${pct >= 100 ? `<span class="lesson-check">${Icons.trophy()}</span>` : ""}
        </div>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-progress-row">
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <span>${doneCount}/${course.lessons.length}</span>
        </div>
      `;
      card.onclick = () => App.openCourse(course.id);
      container.appendChild(card);
    }
    Theme.tiltAll(".course-card");
  },

  async lessonList(container, courseId) {
    const course = await DB.getCourse(courseId);
    const progress = await DB.getProgressForCourse(courseId);
    const doneIds = new Set(progress.filter((p) => p.done).map((p) => p.lessonId));
    container.innerHTML = `<h2>${course.title}</h2><p class="muted">${course.description}</p>`;
    const list = document.createElement("div");
    list.className = "lesson-list";
    for (const lessonId of course.lessons) {
      const lesson = await DB.getLesson(courseId, lessonId);
      if (!lesson) continue;
      const done = doneIds.has(lessonId);
      const row = document.createElement("div");
      row.className = "lesson-row";
      row.innerHTML = `
        <span class="lesson-check">${done ? Icons.check() : Icons.circleEmpty()}</span>
        <div class="lesson-row-text">
          <strong>${lesson.title}</strong>
          <span class="muted">${
            lesson.type === "quiz"
              ? `${Icons.bulb()} Quiz`
              : `${Icons.clock()} ${(lesson.estimatedMinutes || 5) + " min"}`
          }</span>
        </div>
      `;
      row.onclick = () => App.openLesson(courseId, lessonId);
      list.appendChild(row);
    }
    container.appendChild(list);
  },

  async lessonView(container, courseId, lessonId) {
    const lesson = await DB.getLesson(courseId, lessonId);
    container.innerHTML = `<h2>${lesson.title}</h2>`;
    const body = document.createElement("div");
    body.className = "lesson-body";
    for (const block of lesson.content || []) {
      body.appendChild(this._block(block));
    }
    if (lesson.quiz && lesson.quiz.length) {
      body.appendChild(this._quiz(lesson.quiz));
    }
    container.appendChild(body);

    const doneBtn = document.createElement("button");
    doneBtn.className = "primary-btn";
    doneBtn.innerHTML = `${Icons.check()} <span>Mark as complete</span>`;
    doneBtn.onclick = async () => {
      await DB.setProgress(courseId, lessonId, true);
      App.openCourse(courseId);
    };
    container.appendChild(doneBtn);
  },

  _block(block) {
    const el = document.createElement("div");
    el.className = `block block-${block.type}`;
    switch (block.type) {
      case "heading":
        el.innerHTML = `<h3>${block.value}</h3>`;
        break;
      case "text":
        el.innerHTML = `<p>${block.value}</p>`;
        break;
      case "code":
        el.innerHTML = `<pre><code>${(block.value || "").replace(/</g, "&lt;")}</code></pre>`;
        break;
      case "image":
        el.innerHTML = `<img src="${block.url}" alt="${block.alt || ""}" />`;
        break;
      case "tip":
        el.innerHTML = `<div class="tip">${Icons.bulb()} ${block.value}</div>`;
        break;
      case "list":
        el.innerHTML = `<ul>${(block.items || []).map((i) => `<li>${i}</li>`).join("")}</ul>`;
        break;
    }
    return el;
  },

  _quiz(questions) {
    const wrap = document.createElement("div");
    wrap.className = "quiz";
    questions.forEach((q, qi) => {
      const qEl = document.createElement("div");
      qEl.className = "quiz-question";
      qEl.innerHTML = `<p><strong>${q.question}</strong></p>`;
      q.options.forEach((opt, oi) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.textContent = opt;
        btn.onclick = () => {
          btn.classList.add(oi === q.answer ? "correct" : "wrong");
          [...qEl.querySelectorAll(".quiz-option")].forEach((b) => (b.disabled = true));
        };
        qEl.appendChild(btn);
      });
      wrap.appendChild(qEl);
    });
    return wrap;
  },
};
