/**
 * auth.js — Google sign-in (Firebase) + guest mode.
 * Guest mode is just a localStorage flag; it never touches Firebase or GitHub.
 */
const GUEST_FLAG = "learning_app_guest_mode";

const Auth = {
  isGuest() {
    return localStorage.getItem(GUEST_FLAG) === "1";
  },
  enterGuestMode() {
    localStorage.setItem(GUEST_FLAG, "1");
  },
  exitGuestMode() {
    localStorage.removeItem(GUEST_FLAG);
  },
  async signInWithGoogle() {
    this.exitGuestMode();
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider);
  },
  async signOut() {
    await auth.signOut();
  },
  /**
   * Calls onChange(user|null, isGuest) whenever auth state is known/changes.
   * This is the single source of truth the rest of the app listens to.
   */
  onStateChange(onChange) {
    auth.onAuthStateChanged((user) => {
      onChange(user, !user && this.isGuest());
    });
  },
};
