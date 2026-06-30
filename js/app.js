/**
 * app.js — main controller. Wires together db, seed, auth, sync, render.
 * Functional flow is unchanged from the original app; this version adds
 * the settings screen, theme switching, and small UI polish hooks.
 */
const App = {
  state: { screen: "splash", courseId: null, lessonId: null, user: null, isGuest: false, previousScreen: "home" },

  async init() {
    Theme.init();
    Theme.attachRippleDelegation();
    this.injectStaticIcons();
    this.buildSettingsScreen();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js").catch(console.error);
    }
    await Seed.seedIfNeeded();

    Auth.onStateChange((user, isGuest) => {
      this.state.user = user;
      this.state.isGuest = isGuest;
      this.updateHeader();
      if (user) this.runSync();
      if (user || isGuest) {
        if (this.state.screen === "splash" || this.state.screen === "login") {
          this.goHome();
        }
      } else {
        this.showScreen("login");
      }
    });

    document.getElementById("btn-get-started").onclick = () => this.showScreen("login");
    document.getElementById("btn-google").onclick = () => Auth.signInWithGoogle().catch((e) => alert(e.message));
    document.getElementById("btn-guest").onclick = () => {
      Auth.enterGuestMode();
      this.state.isGuest = true;
      this.updateHeader();
      this.goHome();
    };
    document.getElementById("btn-back-courses").onclick = () => this.goHome();
    document.getElementById("btn-back-lesson").onclick = () => this.openCourse(this.state.courseId);
    document.getElementById("btn-signout").onclick = async () => {
      Auth.exitGuestMode();
      if (this.state.user) await Auth.signOut();
      this.showScreen("login");
    };

    document.getElementById("btn-settings").onclick = () => this.openSettings();
    document.getElementById("btn-back-settings").onclick = () => this.showScreen(this.state.previousScreen);
  },

  // Fill in the small static icon slots that don't depend on rendered data.
  injectStaticIcons() {
    document.getElementById("app-logo").innerHTML = Icons.logo();
    document.getElementById("splash-hero").innerHTML = Icons.book();
    document.getElementById("btn-settings").innerHTML = Icons.settings();
    document.getElementById("signout-icon").innerHTML = Icons.signOut();
    document.getElementById("back-courses-icon").innerHTML = Icons.back();
    document.getElementById("back-lesson-icon").innerHTML = Icons.back();
    document.getElementById("back-settings-icon").innerHTML = Icons.back();
    document.querySelectorAll(".sparkle-field .sp").forEach((el) => (el.innerHTML = Icons.sparkle()));
    document.querySelector(".ic-sun") && (document.querySelector(".ic-sun").innerHTML = Icons.sun());
    document.querySelector(".ic-moon") && (document.querySelector(".ic-moon").innerHTML = Icons.moon());
    document.querySelector(".ic-sparkle") && (document.querySelector(".ic-sparkle").innerHTML = Icons.sparkle());
  },

  // Build the theme-swatch grid and wire up the appearance/motion controls.
  buildSettingsScreen() {
    const grid = document.getElementById("theme-grid");
    grid.innerHTML = Theme.THEMES.map(
      (t) => `
      <button class="theme-swatch" data-theme-id="${t.id}">
        <span class="check-mark">${Icons.check()}</span>
        <div class="dot-pair">
          <span class="dot" style="background:${t.swatch[0]}"></span>
          <span class="dot" style="background:${t.swatch[1]}"></span>
        </div>
        <div class="label">${t.name}</div>
      </button>`
    ).join("");

    const refreshThemeUI = () => {
      grid.querySelectorAll(".theme-swatch").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.themeId === Theme.state.theme);
      });
      document.querySelectorAll("#mode-toggle button").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.mode === Theme.state.mode);
      });
      document.getElementById("motion-switch").classList.toggle("on", !Theme.state.reduceMotion);
    };

    grid.querySelectorAll(".theme-swatch").forEach((btn) => {
      btn.onclick = () => {
        Theme.setTheme(btn.dataset.themeId);
        refreshThemeUI();
      };
    });

    document.querySelectorAll("#mode-toggle button").forEach((btn) => {
      btn.onclick = () => {
        Theme.setMode(btn.dataset.mode);
        refreshThemeUI();
      };
    });

    document.getElementById("motion-switch").onclick = (e) => {
      Theme.setReduceMotion(e.currentTarget.classList.contains("on"));
      refreshThemeUI();
    };

    this._refreshThemeUI = refreshThemeUI;
    refreshThemeUI();
  },

  openSettings() {
    this.state.previousScreen = this.state.screen === "settings" ? this.state.previousScreen : this.state.screen;
    this._refreshThemeUI && this._refreshThemeUI();
    this.showScreen("settings");
  },

  async runSync() {
    const banner = document.getElementById("sync-banner");
    banner.textContent = "Checking for updates...";
    banner.classList.remove("hidden");
    const result = await Sync.syncFromGitHub((msg) => (banner.textContent = msg));
    if (result.updated.length) {
      banner.textContent = `Updated: ${result.updated.join(", ")}`;
      if (this.state.screen === "home") this.goHome();
    } else if (result.errors.length) {
      banner.textContent = "Offline — using saved lessons.";
    } else {
      banner.textContent = "Up to date.";
    }
    setTimeout(() => banner.classList.add("hidden"), 2500);
  },

  updateHeader() {
    const label = document.getElementById("account-label");
    if (this.state.user) {
      label.textContent = this.state.user.displayName || this.state.user.email;
    } else if (this.state.isGuest) {
      label.textContent = "Guest";
    } else {
      label.textContent = "";
    }
  },

  showScreen(name) {
    if (name !== "settings") this.state.previousScreen = name;
    this.state.screen = name;
    document.querySelectorAll(".screen").forEach((s) => {
      s.classList.add("hidden");
      s.classList.remove("screen-enter");
    });
    const target = document.getElementById(`screen-${name}`);
    target.classList.remove("hidden");
    // restart the entrance animation
    void target.offsetWidth;
    target.classList.add("screen-enter");
  },

  async goHome() {
    this.showScreen("home");
    await Render.courseList(document.getElementById("course-list"));
    Theme.tiltAll(".course-card");
  },

  async openCourse(courseId) {
    this.state.courseId = courseId;
    this.showScreen("course");
    const container = document.getElementById("course-detail");
    container.innerHTML = "";
    await Render.lessonList(container, courseId);
  },

  async openLesson(courseId, lessonId) {
    this.state.courseId = courseId;
    this.state.lessonId = lessonId;
    this.showScreen("lesson");
    const container = document.getElementById("lesson-detail");
    container.innerHTML = "";
    await Render.lessonView(container, courseId, lessonId);
  },
};

window.addEventListener("DOMContentLoaded", () => App.init());
