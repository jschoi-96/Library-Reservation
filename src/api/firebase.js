// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
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
import * as cors from "cors";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfyufLQ2flg0deuFy3gd13jMhOkMg3mi0",
  authDomain: "library-reservation-a13bd.firebaseapp.com",
  databaseURL:
    "https://library-reservation-a13bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "library-reservation-a13bd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const database = getDatabase(app);
// Initialize Cloud Firestore and get a reference to the service

export const firestoreDb = getFirestore(app);

// export async function login() {
//   // async -> 비동기함수
//   // if necessary, login

//   return signInWithPopup(auth, provider) // return promise
//     .then((result) => async () => {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;
//       // The signed-in user info.
//       const user = result.user;

//       // IdP data available using getAdditionalUserInfo(result)
//       // ...
//       const data = {
//         name: result.user.displayName,
//         email: result.user.email,
//         uid: result.user.uid,
//         seat_reservation_status: 0,
//         daily_count: 0,
//         weekly_count: 0,
//       };
//       // added data
//       await setDoc(doc(firestoreDb, "users", result.user.displayName), data);

//       return user;
//     })
//     .catch(console.error);
// }

export async function login() {
  // if necessary, login
  try {
    await signInWithRedirect(auth, provider);
    const result = await getRedirectResult(auth);
    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    const data = {
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      seat_reservation_status: 0,
      daily_count: 0,
      weekly_count: 0,
    };

    await setDoc(doc(firestoreDb, "users", user.displayName), data);

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function logout() {
  return signOut(auth).then(() => null);
}

// if user state changes, call callback function
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    // if there is a user (loggedin)

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

  // 2. {...user , isAdmin: true / false}
}
