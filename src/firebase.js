import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCTmf1BN5BnuHxxxKm1gnAPi-i3Gc1ypc8",
  authDomain: "auction-c3dd7.firebaseapp.com",
  databaseURL: "https://auction-c3dd7-default-rtdb.firebaseio.com",
  projectId: "auction-c3dd7",
  storageBucket: "auction-c3dd7.firebasestorage.app",
  messagingSenderId: "367661818097",
  appId: "1:367661818097:web:e41e632ddabcc4bb3e0950",
  measurementId: "G-G14STNMTS3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, onValue };
