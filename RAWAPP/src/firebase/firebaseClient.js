import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHvXIQtsgPKW6Zg1HGk_avuDCzLE_rEv0",
  authDomain: "chat-app-1a9cb.firebaseapp.com",
  projectId: "chat-app-1a9cb",
  storageBucket: "chat-app-1a9cb.firebasestorage.app",
  messagingSenderId: "167380730708",
  appId: "1:167380730708:web:c8ba282cd88799f24f3ec1",
  measurementId: "G-NK5DH94Q3B"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
