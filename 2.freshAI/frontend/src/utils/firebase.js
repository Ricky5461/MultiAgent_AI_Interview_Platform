import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "freshai-f7435.firebaseapp.com",
  projectId: "freshai-f7435",
  storageBucket: "freshai-f7435.firebasestorage.app",
  messagingSenderId: "336301144192",
  appId: "1:336301144192:web:5799848026407fb678ce65"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider();

export {auth, provider}