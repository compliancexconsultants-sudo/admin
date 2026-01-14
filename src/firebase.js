import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔥 Paste YOUR firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyD3CB2MQ9Oet1eZuRputC23J5meGx-RQwA",
  authDomain: "admin-legalhub.firebaseapp.com",
  projectId: "admin-legalhub",
  storageBucket: "admin-legalhub.firebasestorage.app",
  messagingSenderId: "516572864964",
  appId: "1:516572864964:web:e4ef7f7813dbae10b08491",
  measurementId: "G-8J3SGX6SMQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
