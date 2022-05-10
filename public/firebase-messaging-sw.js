// // importScripts("https://www.gstatic.com/firebasejs/8.9.1/firebase-app.js");
// // importScripts("https://www.gstatic.com/firebasejs/8.9.1/firebase-messaging.js");

// // const firebaseConfig = {
// //   apiKey: "AIzaSyDRqroUbN8TvnEXutyei7-VF_0lkAMUU4U",
// //   authDomain: "unome-3cbe9.firebaseapp.com",
// //   projectId: "unome-3cbe9",
// //   storageBucket: "unome-3cbe9.appspot.com",
// //   messagingSenderId: "720364245990",
// //   appId: "1:720364245990:web:a81fa5106b3328c2c27c27",
// //   measurementId: "${config.measurementId}",
// // };

// // // eslint-disable-next-line no-undef
// // firebase.initializeApp(firebaseConfig);

// // // Retrieve firebase messaging
// // // eslint-disable-next-line no-undef
// // const messaging = firebase.messaging();

// // messaging.onBackgroundMessage(function (payload) {
// //   console.log("Received background message ", payload);

// //   const notificationTitle = payload.notification.title;
// //   const notificationOptions = {
// //     body: payload.notification.body,
// //     icon: "/logo192.png",
// //   };

// //   // eslint-disable-next-line no-restricted-globals
// //   return self.registration.showNotification(
// //     notificationTitle,
// //     notificationOptions
// //   );
// // });

// import app from "../src/firebase/firebase";
// // eslint-disable-next-line no-restricted-globals

// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// // if ("serviceWorker" in navigator) {
// //   navigator.serviceWorker
// //     .register("../firebase-messaging-sw.js")
// //     .then(function (registration) {
// //       console.log("Registration successful, scope is:", registration.scope);
// //     })
// //     .catch(function (err) {
// //       console.log("Service worker registration failed, error:", err);
// //     });
// // }

// app.initializeApp({
//   messagingSenderId: "720364245990",
// });

// const initMessaging = app.messaging();

// initMessaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDRqroUbN8TvnEXutyei7-VF_0lkAMUU4U",
  authDomain: "unome-3cbe9.firebaseapp.com",
  projectId: "unome-3cbe9",
  storageBucket: "unome-3cbe9.appspot.com",
  messagingSenderId: "720364245990",
  appId: "1:720364245990:web:a81fa5106b3328c2c27c27",
  measurementId: "G-KT6VQHNPCF",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  if (event.action) {
    clients.openWindow(event.action);
  }
  event.notification.close();
});
