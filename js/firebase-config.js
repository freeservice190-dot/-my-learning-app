/**
 * firebase-config.js
 *
 * 1. Go to https://console.firebase.google.com -> create a project.
 * 2. Project settings -> General -> "Your apps" -> Web app -> copy the config below.
 * 3. Authentication -> Sign-in method -> enable "Google".
 * 4. Paste your real values here. This file is safe to be public —
 *    Firebase web config is not a secret, access is controlled by
 *    Firebase Auth + your security rules, not by hiding this object.
 */
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
