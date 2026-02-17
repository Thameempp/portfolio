import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDQWTwvOzR5yy7ssuKywDctFf2gD38VeSs",
    authDomain: "my-portfolio-e460b.firebaseapp.com",
    projectId: "my-portfolio-e460b",
    storageBucket: "my-portfolio-e460b.firebasestorage.app",
    messagingSenderId: "809721998021",
    appId: "1:809721998021:web:f3eb7f406dec9a13855eac",
    measurementId: "G-0PN8W4YS4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
