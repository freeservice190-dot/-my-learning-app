/**
 * icons.js — small inline-SVG icon set. Icons use currentColor so they pick
 * up theme colors automatically. Pure presentation, no functional logic.
 */
const Icons = {
  _svg(inner, vb = "0 0 24 24") {
    return `<svg viewBox="${vb}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
  },
  logo() {
    return this._svg(`
      <path d="M4 5.5C4 4.67 4.67 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" fill="currentColor" opacity=".55"/>
      <path d="M20 5.5c0-.83-.67-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" fill="currentColor"/>
    `);
  },
  settings() {
    return this._svg(`
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" stroke-width="1.8"/>
      <path d="M19.4 13.5a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19.5a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4.5a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 6.1 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 8.54 3.9l.06.06a1.65 1.65 0 0 0 1.82.33H10.5a1.65 1.65 0 0 0 1-1.51V2.5a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8.5a1.65 1.65 0 0 0 1.51 1h.09a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" opacity=".55"/>
    `);
  },
  back() {
    return this._svg(`<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`);
  },
  arrowRight() {
    return this._svg(`<path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`);
  },
  check() {
    return this._svg(`
      <circle cx="12" cy="12" r="9.2" fill="currentColor"/>
      <path d="M8 12.3l2.6 2.6L16.2 9" stroke="var(--surface)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    `);
  },
  circleEmpty() {
    return this._svg(`<circle cx="12" cy="12" r="8.7" stroke="currentColor" stroke-width="1.8" opacity=".45"/>`);
  },
  sun() {
    return this._svg(`
      <circle cx="12" cy="12" r="4.3" fill="currentColor"/>
      <g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/>
      </g>
    `);
  },
  moon() {
    return this._svg(`<path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z" fill="currentColor"/>`);
  },
  sparkle() {
    return this._svg(`<path d="M12 2.5c.6 3.6 1.7 5.5 4.5 6.5-2.8 1-3.9 2.9-4.5 6.5-.6-3.6-1.7-5.5-4.5-6.5 2.8-1 3.9-2.9 4.5-6.5Z" fill="currentColor"/>`);
  },
  trophy() {
    return this._svg(`
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
      <path d="M7 5H4.5A2.5 2.5 0 0 0 5 9.9M17 5h2.5A2.5 2.5 0 0 1 19 9.9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      <path d="M12 13v3.2M9 20h6M9.6 16.2h4.8a1 1 0 0 1 1 1V20H8.6v-2.8a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
    `);
  },
  flame() {
    return this._svg(`<path d="M12 2.8c.3 3 2.6 4.4 4 6.4a6 6 0 1 1-10.6 3.7c0-2.4 1.2-3.6 1.2-3.6s.4 1.4 1.4 1.8c-.6-3 1.6-4.6 4-8.3Z" fill="currentColor"/>`);
  },
  book() {
    return this._svg(`
      <path d="M4 5.2C4 4.5 4.6 4 5.3 4H11v15.5H5.3A1.3 1.3 0 0 1 4 18.2V5.2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M20 5.2c0-.7-.6-1.2-1.3-1.2H13v15.5h5.7a1.3 1.3 0 0 0 1.3-1.3V5.2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    `);
  },
  code() {
    return this._svg(`<path d="M8.5 8.5L4 12l4.5 3.5M15.5 8.5L20 12l-4.5 3.5M13.2 5.5l-2.4 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`);
  },
  bulb() {
    return this._svg(`
      <path d="M9 18h6M9.5 21h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      <path d="M12 3a6.5 6.5 0 0 0-3.6 11.9c.6.4 1.1 1.2 1.1 2.1h5a2.4 2.4 0 0 1 1.1-2.1A6.5 6.5 0 0 0 12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
    `);
  },
  clock() {
    return this._svg(`<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`);
  },
  signOut() {
    return this._svg(`<path d="M14 7V5.5A1.5 1.5 0 0 0 12.5 4h-6A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20h6a1.5 1.5 0 0 0 1.5-1.5V17M19 12H10m9 0l-3-3m3 3l-3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`);
  },
  palette() {
    return this._svg(`<path d="M12 3.5a8.5 7.5 0 1 0 0 15c1 0 1.7-.8 1.7-1.7 0-.45-.18-.85-.46-1.15-.28-.3-.46-.7-.46-1.15 0-.9.75-1.65 1.65-1.65H16a4 4 0 0 0 4-4c0-3.3-3.6-6.35-8-6.35Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="8" cy="11" r="1.1" fill="currentColor"/><circle cx="11.2" cy="7.8" r="1.1" fill="currentColor"/><circle cx="15" cy="8.6" r="1.1" fill="currentColor"/>`);
  },
};
