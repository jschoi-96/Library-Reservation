// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { getDatabase, ref, child, get, update } from "firebase/database";
import {
  getFirestore,
  getDocs,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const database = getDatabase(app);
// Initialize Cloud Firestore and get a reference to the service

export const firestoreDb = getFirestore(app);

export async function login() {
  // async -> 비동기함수
  // if necessary, login

  return signInWithPopup(auth, provider) // return promise
    .then((result) => async () => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      // IdP data available using getAdditionalUserInfo(result)
      // ...
      const data = {
        name: result.user.displayName,
        email: result.user.email,
        uid: result.user.uid,
      };

      await setDoc(doc(firestoreDb, "users", result.user.displayName), data);

      return user;
    })
    .catch(console.error);
}

export async function logout() {
  return signOut(auth).then(() => null);
}

// if user state changes, call callback function
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    // if there is a user (loggedin)s

    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}

async function adminUser(user) {
  // 1. check if user has admin authorization

  return get(ref(database, "admins")) //
    .then((snapshot) => {
      if (snapshot.exists) {
        const admins = snapshot.val();
        const isAdmin = admins.includes(user.uid);
        return { ...user, isAdmin };
      }
    });
  return user;
  // 2. {...user , isAdmin: true / false}
}
