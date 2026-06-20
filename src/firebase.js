import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
apiKey: "AIzaSyAQacOyJ5t_Br-CAy3nk9xD5pHtuNPEA60",
  authDomain: "get-it-done-6f32a.firebaseapp.com",
  projectId: "get-it-done-6f32a",
  storageBucket: "get-it-done-6f32a.firebasestorage.app",
  messagingSenderId: "939137398385",
  appId: "1:939137398385:web:21cd9d09d057f786b08dd0",
  measurementId: "G-EE4C8SLBQC"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
