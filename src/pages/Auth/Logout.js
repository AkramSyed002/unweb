import React, { useEffect } from "react";
import LoadingModal from "../../components/members/modals/LoadingModal";
import { removeFCMToken } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
const Logout = () => {
  const history = useHistory();
  useEffect(() => {
    logoutUser();
  }, []);

  const logoutUser = async () => {
    await removeFCMToken();
    firebase
      .auth()
      .signOut()
      .then(async () => {
        try {
          indexedDB.deleteDatabase("firebaseLocalStorageDb");
          history.push("/");
        } catch (error) {
          console.log("Remove token", error);
        }
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.log("Signout", error);
      });
  };
  return <LoadingModal modalVisible={true} />;
};

export default Logout;
