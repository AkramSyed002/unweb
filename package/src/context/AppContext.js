import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CollectionNames,
  MEMBER_STATUS_OPTIONS,
  NotificationStatusInitial,
} from "../constants";
import {
  getAllAdmins,
  getAllMembers,
  getAppOptions,
  getConfirmationOptions,
  getFirestoreCollection,
  getMemberById,
  getNotifications,
  getNotificationStatusesByID,
  getRestaurantsByIDs,
} from "../firebase/services";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [locationsOptions, setLocationsOptions] = useState([]);
  const [featureOptions, setFeatureOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [confirmationTypes, setConfirmationTypes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [menu, setMenu] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsStatuses, setNotificationsStatuses] = useState([]);

  const { currentAuth, currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      _getInitialRestaurantData();
      _getInitialMembersList();
      _getAllAdmins();
      _getAppOptions();
      _getAllNotifications();
      _getCurrentAdminPreferences();
    }
  }, [currentUser]);

  const _getInitialData = async (collectionName, setState1, setState2) => {
    try {
      let tempArray1 = [];
      let tempArray2 = [];
      const snapshot = await getFirestoreCollection(collectionName);
      if (!setState2) {
        snapshot.forEach((doc) =>
          tempArray1.push({ ...doc.data(), id: doc.id })
        );
        setState1(tempArray1);
      } else {
        snapshot.forEach((doc) => {
          if (doc.data().status === MEMBER_STATUS_OPTIONS.PENDING)
            tempArray1.push({ ...doc.data(), id: doc.id });
          else tempArray2.push({ ...doc.data(), id: doc.id });
        });
        setState1(tempArray1);
        setState2(tempArray2);
      }
    } catch (error) {
      console.log("Error get admins", error);
    }
  };

  const _getInitialMembersList = async () => await getAllMembers(setMembers);

  const _getInitialRestaurantData = async () => {
    _getInitialData(CollectionNames.RESTAURANTS, setRestaurants);
  };

  const _getAllAdmins = async () => {
    const admins = await getAllAdmins();
    setAdmins(admins);
  };

  const _getAppOptions = async () => {
    try {
      const adminSnapshot = await getAppOptions();
      adminSnapshot.forEach((doc) => {
        if (doc.id === "features") {
          setFeatureOptions(doc.data().values);
        }
        if (doc.id === "locations") setLocationsOptions(doc.data().values);
        if (doc.id == "tags") setTagOptions(doc.data().values);
      });
      const snap = await getConfirmationOptions();
      let temp = [];
      snap.forEach((doc) => {
        temp.push(doc.data());
      });
      setConfirmationTypes(temp);
    } catch (error) {
      console.log("Error get admins", error);
    }
  };

  const _getAllNotifications = async () => {
    const allNotifications = await getNotifications();
    setNotifications(allNotifications);
  };

  const _getCurrentAdminPreferences = async () => {
    const notificationStatusInitial = [...NotificationStatusInitial];

    const doc = await getNotificationStatusesByID(currentAuth.uid);

    if (!doc.exists) setNotificationsStatuses(notificationStatusInitial);
    else
      setNotificationsStatuses(
        Object.assign(notificationStatusInitial, doc.data().statuses)
      );
  };

  return (
    <AppContext.Provider
      value={{
        restaurants,
        setRestaurants,
        admins,
        setAdmins,
        locationsOptions,
        setLocationsOptions,
        featureOptions,
        setFeatureOptions,
        tagOptions,
        bookings,
        setBookings,
        confirmationTypes,
        setConfirmationTypes,
        members,
        setMembers,
        menu,
        setMenu,
        menuItems,
        setMenuItems,
        selectedRestaurant,
        setSelectedRestaurant,
        notifications,
        setNotifications,
        notificationsStatuses,
        setNotificationsStatuses,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
