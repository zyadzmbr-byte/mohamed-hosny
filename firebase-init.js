// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAP5y7HnwhtDluewNkj_HhXXo_n6YTX1CE",
    authDomain: "mohamed-hosny-870e8.firebaseapp.com",
    projectId: "mohamed-hosny-870e8",
    storageBucket: "mohamed-hosny-870e8.firebasestorage.app",
    messagingSenderId: "920541729402",
    appId: "1:920541729402:web:5befbb421bd774723ae1c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
