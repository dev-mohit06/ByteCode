// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEAqafHKNkG6llPY8L3OL7ryEaynFQ7dI",
  authDomain: "bytekod.firebaseapp.com",
  projectId: "bytekod",
  storageBucket: "bytekod.appspot.com",
  messagingSenderId: "172369338650",
  appId: "1:172369338650:web:32a3fca72d0e12a7ae8ca3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider  = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;
    try{
        user = (await signInWithPopup(auth, provider)).user;
    }catch(error){
        throw error;
    }
    return user;
}