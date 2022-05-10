import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
import "firebase/messaging";

var firebaseConfig = {
  apiKey: "AIzaSyDRqroUbN8TvnEXutyei7-VF_0lkAMUU4U",
  authDomain: "unome-3cbe9.firebaseapp.com",
  projectId: "unome-3cbe9",
  storageBucket: "unome-3cbe9.appspot.com",
  messagingSenderId: "720364245990",
  appId: "1:720364245990:web:a81fa5106b3328c2c27c27",
  measurementId: "${config.measurementId}",
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const messagingPublicKey =
  "BN3EaK3zRdZ2qmBkASnAxFwt1WWF6FnKOyDBN3tyE7IiCqh6MADM5ZLhM1a_DnC5Pgz80mhrzacrJCnq36mP5js";

export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();
export const functions = app.functions();
export const messaging = app.messaging();

export default app;
