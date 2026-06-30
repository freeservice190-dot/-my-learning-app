/**
 * theme.js — handles the 4 color themes + light/dark mode, persists choice,
 * and provides small touch/3D micro-interaction helpers used across the app.
 * Purely presentational: does not touch course/lesson/auth data or logic.
 */
const Theme = {
  THEMES: [
    { id: "violet", name: "Violet", swatch: ["#7c6cf6", "#a78bfa"] },
    { id: "ocean", name: "Ocean", swatch: ["#2f6fed", "#21c3a6"] },
    { id: "sunset", name: "Sunset", swatch: ["#ff7a45", "#ffb22e"] },
    { id: "crimson", name: "Crimson", swatch: ["#e83b5e", "#ff6b81"] },
  ],

  THEME_COLORS: {
    violet: { light: "#f3eefc", dark: "#15101f" },
    ocean: { light: "#eaf4ff", dark: "#0b1626" },
    sunset: { light: "#fff3ea", dark: "#241510" },
    crimson: { light: "#fbeef0", dark: "#15080a" },
  },

  state: { theme: "violet", mode: "light", reduceMotion: false },

  init() {
    const savedTheme = localStorage.getItem("la-theme");
    const savedMode = localStorage.getItem("la-mode");
    const savedMotion = localStorage.getItem("la-reduce-motion");
    const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const systemReduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.state.theme = savedTheme || "violet";
    this.state.mode = savedMode || (systemPrefersDark ? "dark" : "light");
    this.state.reduceMotion = savedMotion === "1" || (savedMotion === null && systemReduceMotion);

    this.apply();
  },

  apply() {
    const root = document.documentElement;
    root.setAttribute("data-theme", this.state.theme);
    root.setAttribute("data-mode", this.state.mode);
    root.classList.toggle("reduce-motion", this.state.reduceMotion);
    const meta = document.querySelector('meta[name="theme-color"]');
    const colors = this.THEME_COLORS[this.state.theme];
    if (meta && colors) meta.setAttribute("content", colors[this.state.mode]);
  },

  setTheme(themeId) {
    this.state.theme = themeId;
    localStorage.setItem("la-theme", themeId);
    this.apply();
  },

  setMode(mode) {
    this.state.mode = mode;
    localStorage.setItem("la-mode", mode);
    this.apply();
  },

  toggleMode() {
    this.setMode(this.state.mode === "light" ? "dark" : "light");
  },

  setReduceMotion(on) {
    this.state.reduceMotion = on;
    localStorage.setItem("la-reduce-motion", on ? "1" : "0");
    this.apply();
  },

  /* ---------- micro-interactions ---------- */

  // Expanding "ripple/glow" feedback on tap — delegated globally so it
  // automatically covers buttons and cards rendered later by Render.
  attachRippleDelegation() {
    const targets = ".primary-btn, .secondary-btn, .course-card, .lesson-row, .quiz-option, .theme-swatch, .icon-btn, .mode-toggle";
    document.addEventListener("pointerdown", (e) => {
      if (this.state.reduceMotion) return;
      const el = e.target.closest(targets);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height) * 1.6;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      const prevPosition = getComputedStyle(el).position;
      if (prevPosition === "static") el.style.position = "relative";
      el.style.overflow = el.style.overflow || "hidden";
      el.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  },

  // Subtle 3D tilt that follows the pointer — gives cards a light, "alive"
  // feel without being distracting. No-ops under reduced motion.
  attachTilt(el, maxDeg = 6) {
    if (!el || el.dataset.tiltBound) return;
    el.dataset.tiltBound = "1";
    let frame = null;
    const reset = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", (e) => {
      if (this.state.reduceMotion) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `perspective(700px) rotateX(${(-py * maxDeg).toFixed(2)}deg) rotateY(${(px * maxDeg).toFixed(2)}deg) translateZ(0)`;
      });
    });
    el.addEventListener("pointerleave", reset);
    el.addEventListener("pointerup", reset);
  },

  tiltAll(selector) {
    document.querySelectorAll(selector).forEach((el) => this.attachTilt(el));
  },
};
