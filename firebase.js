// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCZ-QeZrs6qJlDk4ZMs9LP2iQ4wjJ2vcF8",
  authDomain: "artkart-69692.firebaseapp.com",
  projectId: "artkart-69692",
  storageBucket: "artkart-69692.appspot.com",
  messagingSenderId: "1067935304156",
  appId: "1:1067935304156:web:d8c50769ecb9797f8d6719"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);