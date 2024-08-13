// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: "instagram-296d0.firebaseapp.com",
      projectId: "instagram-296d0",
      storageBucket: "instagram-296d0.appspot.com",
      messagingSenderId: "691498798799",
      appId: "1:691498798799:web:b5bd8b237cdcd6a286b1ba",
      measurementId: "G-14FTKFHX5V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
