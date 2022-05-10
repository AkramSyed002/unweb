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
const messagingPublicKey =
  "BN3EaK3zRdZ2qmBkASnAxFwt1WWF6FnKOyDBN3tyE7IiCqh6MADM5ZLhM1a_DnC5Pgz80mhrzacrJCnq36mP5js";

const messaging = app.messaging();
export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();
export const functions = app.functions();

export const getServerTime = () =>
  firebase.firestore.FieldValue.serverTimestamp();

export default app;

const adminRef = firestore.collection("admin");
const adminPreferencesRef = firestore.collection("admin_preferences");
// Notifications
export const getToken = async () => {
  let currentToken = "";
  const uid = auth.currentUser.uid;
  const adminDoc = await adminPreferencesRef.doc(uid).get();
  // Check if there is token

  if (adminDoc.data().fcmToken !== null) return;

  try {
    currentToken = await messaging.getToken({ vapidKey: messagingPublicKey });
    console.log("FCM Token:", currentToken);
    if (currentToken) {
      localStorage.setItem("fcmToken", "true");
      await adminRef.doc(uid).update({
        fcmToken: currentToken,
      });
      await adminPreferencesRef.doc(uid).update({
        fcmToken: currentToken,
      });
    } else {
      localStorage.setItem("fcmToken", "false");
    }
  } catch (error) {
    console.log("An error occurred while retrieving token.", error);
  }
  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });

export const removeFCMToken = async () => {
  const uid = await auth.currentUser.uid;
  await adminRef.doc(uid).update({ fcmToken: null });
  await adminPreferencesRef.doc(uid).update({ fcmToken: null });
  // await messaging.deleteToken();
  await localStorage.clear();
};
