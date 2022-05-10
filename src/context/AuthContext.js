import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../firebase/firebase";
import firebase from "firebase";
import { getCurrentUser } from "../firebase/services";
import { removeFCMToken } from "../firebase/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // States //
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAuth, setCurrentAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(true);

  //   Auth Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentAuth(user);
      setLoginLoading(false);
    });

    return unsubscribe;
  }, []);

  //   Get User From DB
  useEffect(() => {
    const getUserData = async () => {
      try {
        let userDoc = await getCurrentUser();
        setCurrentUser(userDoc.data());
        setLoading(false);
      } catch (error) {
        console.log("Error Current User", error);
      }
    };

    if (currentAuth) {
      getUserData();
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  }, [currentAuth]);

  //Functions
  const loginUser = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

  const logoutUser = async () => {
    await removeFCMToken();
    return firebase.auth().signOut();
  };

  const sendResetPassword = async (email) =>
    await auth.sendPasswordResetEmail(email);

  const changePassword = (newPassword) => {
    var user = auth.currentUser;
    return user.updatePassword(newPassword);
  };
  const changeEmail = (newEmail) => {
    var user = auth.currentUser;
    return user.updateEmail(newEmail);
  };

  const changePhone = (phone_number) => {
    var user = auth.currentUser;
    return firestore.collection("admin").doc(user.uid).update({ phone_number });
  };

  const changeName = (first_name, last_name) => {
    var user = auth.currentUser;
    return firestore
      .collection("admin")
      .doc(user.uid)
      .update({ first_name, last_name });
  };

  //Auth Provider
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        loading,
        loginLoading,
        currentAuth,
        sendResetPassword,
        changePassword,
        changeEmail,
        changePhone,
        changeName,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
