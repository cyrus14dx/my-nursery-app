import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIkvAbM1-Z1NQL97tsOF4mQc5BpSwAExQ",
  authDomain: "nursery-f7a31.firebaseapp.com",
  projectId: "nursery-f7a31",
  storageBucket: "nursery-f7a31.firebasestorage.app",
  messagingSenderId: "202151742348",
  appId: "1:202151742348:web:23e7fa646c9e194eab24a9",
  measurementId: "G-7EY3KVNYFR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // This is the connection to your database