import {
  auth,
  firestore,
  functions,
  messaging,
  messagingPublicKey,
  storage,
} from "./firebase";
import firebase from "firebase/app";
import uuid from "react-uuid";
import { USER_ROLES } from "../constants";

const usersRef = firestore.collection("users");
const accessCodesRef = firestore.collection("access_codes");
const adminRef = firestore.collection("admin");
const appOptionsRef = firestore.collection("app_options");
const restaurantRef = firestore.collection("restaurants");
const bookingRef = firestore.collection("reservations");
const menuRef = firestore.collection("menu");
const menuItemsRef = firestore.collection("menu_items");
const menuItemsPricingRef = firestore.collection("menu_items_pricing");
const notificationsRef = firestore.collection("notifications");
const adminPreferencesRef = firestore.collection("admin_preferences");

// Firebase Functions
const createAdmin = functions.httpsCallable("createAdmin");

// Admin Services
export const getCurrentUser = async () => {
  const uid = auth.currentUser.uid;
  return adminRef.doc(uid).get();
};

export const addNewAdmin = async (admin) => await createAdmin(admin);

export const getFirestoreCollection = async (collectionName) =>
  await firestore.collection(collectionName).get();

// App Options
export const getAppOptions = async () => await appOptionsRef.get();

export const getTagOptions = async () => await appOptionsRef.doc("tags").get();

export const getAllergiesOptions = async () =>
  await appOptionsRef.doc("allergies").get();

export const getDietaryOptions = async () =>
  await appOptionsRef.doc("dietary_requirements").get();

export const getFeatureOptions = async () =>
  await appOptionsRef.doc("features").get();

export const addOptionTag = async (tags) =>
  await appOptionsRef.doc("tags").set({ values: tags });

export const addAllergiesOption = async (tags) =>
  await appOptionsRef.doc("allergies").set({ values: tags });

export const addDietaryOption = async (tags) =>
  await appOptionsRef.doc("dietary_requirements").set({ values: tags });

export const getRestaurantTags = async () =>
  await appOptionsRef.doc("restaurants_tags").get();

export const addRestaurantTag = async (tags) =>
  await appOptionsRef.doc("restaurants_tags").set({ values: tags });

export const addFeaturesOption = async (tags) =>
  await appOptionsRef.doc("features").set({ values: tags });

export const getConfirmationOptions = async () =>
  await appOptionsRef
    .doc("reservation_confirmation_options")
    .collection("values")
    .get();

export const updateAppOptions = async (documentName, data) =>
  await appOptionsRef.doc(documentName).update({ values: data });

// Restaurants Services
export const addNewRestaurant = async (restaurant) => {
  const userId = auth.currentUser.uid;
  return await restaurantRef.add({ ...restaurant, userId });
};

export const updateFirestoreDocument = async (collectionName, document) =>
  await firestore.collection(collectionName).doc(document.id).update(document);

// Upload file to storage
export const uploadImagesToStorage = async (files) => {
  let downloadUrls = [];
  await Promise.all(
    files.map(async (file) => {
      const ref = storage.ref(`/images/restaurants/${uuid()}`);
      await ref.put(file);
      const url = await ref.getDownloadURL();
      downloadUrls.push(url);
    })
  );
  return downloadUrls;
};

export const uploadSingleImage = async (file) => {
  const ref = storage.ref(`/images/profiles/${uuid()}`);
  await ref.put(file);
  return await ref.getDownloadURL();
};

// Member Services
export const getAllMembers = async (setMembers) => {
  let temp = [];
  const snap = await usersRef.where("status", "!=", "deleted").get();
  snap.forEach((doc) => {
    temp.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  setMembers(temp);
};

export const addNewMember = async (member, pinCode) => {
  const { empty } = await usersRef.where("email", "==", member.email).get();
  if (!empty) return { status: false, message: "Email Already Exists" };
  const { id } = await usersRef.add(member);
  await accessCodesRef.doc(pinCode).set({
    email: member.email,
    user_id: id,
    created_at: new Date(),
    is_used: false,
  });
  return { status: true, message: "Member has been created", uid: id };
};

export const updateMemberByID = async (member) =>
  await usersRef.doc(member.id).update(member);

export const getMemberAccessCode = async (userId) =>
  await accessCodesRef.where("user_id", "==", userId).get();

export const getMemberById = async (userId) => usersRef.doc(userId).get();

export const findUsedAccessCode = async () =>
  await accessCodesRef.where("is_used", "==", true).limit(1).get();

export const getAccessCodes = async () => {
  let codes = [];
  const snap = await accessCodesRef.get();
  snap.forEach((doc) => codes.push(doc.id));
  return codes;
};

export const deleteMemberByID = async (memberId) =>
  await usersRef.doc(memberId).update({ status: "deleted" });

// Member Bookings
export const createBooking = async (booking) => {
  const newBooking = Object.assign({}, booking);
  delete newBooking.user_avatar;
  delete newBooking.user_phone_number;
  delete newBooking.user_name;
  delete newBooking.user_email;
  return await bookingRef.add(newBooking);
};

export const updateBooking = async (booking) => {
  const updatedBooking = Object.assign({}, booking);
  delete updatedBooking.user_avatar;
  delete updatedBooking.user_phone_number;
  delete updatedBooking.user_name;
  delete updatedBooking.user_email;
  return await bookingRef.doc(updatedBooking.id).update(updatedBooking);
};

export const deleteBooking = async (id) => await bookingRef.doc(id).delete();

export const updateBookingStatus = async (id, status) =>
  await bookingRef.doc(id).update({ status });

export const getMemberBookingsById = async (userId) =>
  await bookingRef.where("user_id", "==", userId).get();

export const getRestaurantBookingsByID = async (restaurantID) => {
  const snapshot = await bookingRef
    .where("restaurant_id", "==", restaurantID)
    .get();
  let tempArray = [];
  return new Promise(async (resolve, reject) => {
    snapshot.forEach(async (doc) => {
      const memberDoc = await getMemberById(doc.data().user_id);
      tempArray.push({
        ...doc.data(),
        id: doc.id,
        user_avatar: memberDoc.data()?.profile_image_URL || "",
        user_phone_number: memberDoc.data()?.phone_number,
        user_name: `${memberDoc.data()?.first_name} ${
          memberDoc.data()?.last_name
        }`,
        user_email: memberDoc.data()?.email,
      });
    });
    resolve(tempArray);
  });
};

export const getRestaurantsByIDs = async (restaurantIds) => {
  let temp = [];
  return new Promise(async (resolve, reject) => {
    restaurantIds.forEach(async (el) => {
      let doc = await restaurantRef.doc(el).get();
      temp.push({
        ...doc.data(),
        id: el,
      });
    });
    resolve(temp);
  });
};

// Admin
export const getAllAdmins = () => {
  const uid = auth.currentUser.uid;
  let tempAdmin = [];
  return new Promise(async (resolve, reject) => {
    const adminSnap = await adminRef.where("status", "!=", "deleted").get();
    if (adminSnap.empty) resolve([]);
    adminSnap.forEach(async (adminDocs) => {
      if (adminDocs.id === uid) return;
      let restaurantTemp = [];
      adminDocs.data().location_access.forEach(async (el) => {
        let restaurantDoc = await restaurantRef.doc(el).get();
        if (restaurantDoc.exists) {
          restaurantTemp.push({
            name: restaurantDoc.data().name,
            id: el,
          });
        }
      });
      tempAdmin.push({
        ...adminDocs.data(),
        id: adminDocs.id,
        location_access: restaurantTemp,
      });
    });
    resolve(tempAdmin);
  });
};

export const deleteAdmin = async (adminId) => {
  try {
    await adminRef.doc(adminId).update({
      status: "deleted",
    });
  } catch (error) {}
};

// Menu
export const getMenuByRestaurantId = async (restaurant_id) => {
  let tempMenu = [];
  let index = 0;
  var bar = new Promise(async (resolve, reject) => {
    const menuSnap = await menuRef
      .where("restaurant_id", "==", restaurant_id)
      .get();
    if (menuSnap.empty) resolve([]);
    menuSnap.forEach(async (menuDocs) => {
      let menuCatArray = [];
      let menuCatSnap = await menuRef
        .doc(menuDocs.id)
        .collection("menu_categories")
        .get();
      menuCatSnap.forEach(async (menuCatDocs) => {
        let menuItemsArray = [];
        menuCatDocs.data().menu_items.forEach(async (el) => {
          let menuItemDoc = await menuItemsRef.doc(el).get();
          const menuItemPriceDoc = await menuItemsPricingRef
            .where("menu_item_id", "==", menuItemDoc.id)
            .where("restaurant_id", "==", restaurant_id)
            .get();
          menuItemPriceDoc.forEach((menuItemPriceDoc) => {
            menuItemsArray.push({
              ...menuItemDoc.data(),
              menu_item_id: el,
              ...menuItemPriceDoc.data(),
              menu_item_pricing_id: menuItemPriceDoc.id,
            });
          });
        });
        menuCatArray.push({
          title: menuCatDocs.data().title,
          id: menuCatDocs.id,
          menu_items: menuItemsArray,
          super_category_id: menuCatDocs.data().super_category_id,
        });
      });
      tempMenu.push({
        title: menuDocs.data().title,
        id: menuDocs.id,
        menu_categories: menuCatArray,
      });
      if (index === menuSnap.size - 1) resolve(tempMenu);
      index++;
    });
  });
  return bar;
};

export const getMenuItemsByRestaurantId = async (restaurant_id) => {
  let temp = [];
  let index = 0;
  var bar = new Promise(async (resolve, reject) => {
    const menuItemsSnap = await menuItemsRef
      .where("restaurants_offered", "array-contains", restaurant_id)
      .get();
    if (menuItemsSnap.empty) resolve([]);
    menuItemsSnap.forEach(async (menuItemDoc) => {
      const menuItemPriceDoc = await menuItemsPricingRef
        .where("menu_item_id", "==", menuItemDoc.id)
        .where("restaurant_id", "==", restaurant_id)
        .get();
      menuItemPriceDoc.forEach((doc) => {
        temp.push({
          ...menuItemDoc.data(),
          id: menuItemDoc.id,
          ...doc.data(),
          menu_item_pricing_id: doc.id,
        });
      });
      index++;
      if (index === menuItemsSnap.size - 1) resolve(temp);
    });
  });
  return bar;
};

export const addMenuSuperCategory = async (category) =>
  await menuRef.add(category);

export const addMenuSubCategory = async (menuId, subCategory) =>
  menuRef.doc(menuId).collection("menu_categories").add(subCategory);

export const updateMenuSubCategory = async (
  menuId,
  categoryId,
  subCategory
) => {
  await menuRef
    .doc(menuId)
    .collection("menu_categories")
    .doc(categoryId)
    .update(subCategory);
  sendNotificationToAllUsers("menu_changed", "has made changes to menu");
};

export const deleteMenuItemsFromCategory = (menuItems) => {
  if (menuItems.length <= 0) return;
  menuItems.forEach(async (el) => {
    try {
      await menuItemsRef.doc(el.menu_item_id).delete();
      await menuItemsPricingRef.doc(el.menu_item_pricing_id).delete();
      sendNotificationToAllUsers("menu_changed", "has made changes to menu");
    } catch (error) {
      console.log("Error deleting menu items and pricing", error.message);
    }
  });
};

export const addMenuItemToCategory = async (menuItem) => {
  let newMenuItem = Object.assign({}, menuItem);

  delete newMenuItem.currency;
  delete newMenuItem.price;

  return new Promise(async (resolve, reject) => {
    const menuItemDoc = await menuItemsRef.add(newMenuItem);
    let newMenuItemPricing = {
      price: menuItem.price,
      currency: menuItem.currency,
      restaurant_id: menuItem.restaurants_offered[0],
      menu_item_id: menuItemDoc.id,
    };
    const menuItemPricingDoc = await menuItemsPricingRef.add(
      newMenuItemPricing
    );
    await menuRef
      .doc(menuItem.super_category_id)
      .collection("menu_categories")
      .doc(menuItem.category_id)
      .update({
        menu_items: firebase.firestore.FieldValue.arrayUnion(menuItemDoc.id),
      });

    resolve({
      menuId: menuItemDoc.id,
      menuPriceId: menuItemPricingDoc.id,
    });
  });
};

export const updateMenuItemToCategory = async (menuItem) => {
  let newMenuItem = Object.assign({}, menuItem);

  delete newMenuItem.currency;
  delete newMenuItem.price;
  delete newMenuItem.menu_item_id;

  let newMenuItemPricing = {
    price: menuItem.price,
    currency: menuItem.currency,
  };

  return new Promise(async (resolve, reject) => {
    await menuItemsRef.doc(menuItem.menu_item_id).update(newMenuItem);

    await menuItemsPricingRef
      .doc(menuItem.menu_item_pricing_id)
      .update(newMenuItemPricing);
    sendNotificationToAllUsers("menu_changed", "has made changes to menu");
    resolve(true);
  });
};

export const getNotifications = () =>
  new Promise(async (resolve, reject) => {
    const notificationSnap = await notificationsRef
      .where("target_user_id", "==", auth.currentUser.uid)
      .get();
    if (notificationSnap.empty) resolve([]);
    let temp = [];
    notificationSnap.forEach(async (doc) => {
      const userDoc = await adminRef.doc(doc.data().issuer_user_id).get();
      temp.push({
        id: doc.id,
        ...doc.data(),
        user_avatar: userDoc.data().phot_url ? userDoc.data().phot_url : "",
        user_name: userDoc.data().first_name + " " + userDoc.data().last_name,
      });
    });
    resolve(temp);
  });

export const updateNotification = async (id, notification) =>
  await notificationsRef.doc(id).update(notification);

export const getNotificationStatusesByID = async (userId) =>
  await adminPreferencesRef.doc(userId).get();

export const updateNotificationStatusesByID = async (userId, doc) =>
  await adminPreferencesRef.doc(userId).update({ statuses: doc });

export const updateUserNotificationStatusesByID = async (
  userIds = [],
  notifications = []
) => {
  await Promise.all(
    userIds.map(async (userId) => {
      await adminPreferencesRef
        .doc(userId)
        .set({ statuses: notifications }, { merge: true });
    })
  );
};

// Sorting
export const firestoreSortByKey = async (
  collectionName,
  key,
  order = "asc"
) => {
  let snap = await firestore
    .collection(collectionName)
    .orderBy(key, order)
    .get();
  let temp = [];
  snap.forEach((doc) => {
    temp.push({ id: doc.id, ...doc.data() });
  });
  return temp;
};

export const firestoreFilterByKey = async (collectionName, key, value) => {
  let snap = await firestore
    .collection(collectionName)
    .where(key, "array-contains-any", value)
    .get();
  let temp = [];
  snap.forEach((doc) => {
    temp.push({ id: doc.id, ...doc.data() });
  });
  return temp;
};

// Notifications
export const getToken = async () => {
  let currentToken = "";
  const uid = auth.currentUser.uid;

  // Check if there is token
  if (localStorage.getItem("fcmToken") === "true") return;

  try {
    currentToken = await messaging.getToken({ vapidKey: messagingPublicKey });
    if (currentToken) {
      localStorage.setItem("fcmToken", "true");
      await adminRef.doc(uid).update({
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

export const removeFCMToken = async () => {
  const uid = auth.currentUser.uid;
  await adminRef.doc(uid).update({ fcmToken: null });
  return await localStorage.clear();
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });

export const sendNotificationToAllUsers = async (
  type,
  description,
  actionId
) => {
  const uid = auth.currentUser.uid;
  let allAdminsIds = [];
  const adminsSnap = await adminRef
    .where("role", "!=", USER_ROLES.GENERAL_MANAGER)
    .get();
  await adminsSnap.forEach((adminDoc) => {
    if (adminDoc.id !== uid) {
      allAdminsIds.push(adminDoc.id);
    }
  });

  allAdminsIds.forEach(
    async (adminId) =>
      await notificationsRef.add({
        type: type,
        target_user_id: adminId,
        issuer_user_id: uid,
        id: actionId ? actionId : "",
        seen_at: null,
        created_at: firebase.firestore.Timestamp.now(),
        last_updated_at: firebase.firestore.Timestamp.now(),
        description: description,
      })
  );
  console.log("Notifications Sent To All Admins");
};

export const sendNotificationToManagementUsers = async (
  type,
  description,
  actionId
) => {
  const uid = auth.currentUser.uid;
  let allAdminsIds = [];

  const MANAGEMENT_ROLES = [
    USER_ROLES.ADMIN,
    USER_ROLES.RESERVATIONS_MANAGER,
    USER_ROLES.RESERVATIONS_SUPERVISOR,
  ];
  const promises = MANAGEMENT_ROLES.map((role) =>
    adminRef.where("role", "==", role).get()
  );
  const snapshotsArray = await Promise.all(promises);
  snapshotsArray.forEach((snap) => {
    snap.forEach((doc) => {
      if (doc.id !== uid) {
        allAdminsIds.push(doc.id);
      }
    });
  });

  allAdminsIds.forEach(
    async (adminId) =>
      await notificationsRef.add({
        type: type,
        target_user_id: adminId,
        issuer_user_id: uid,
        id: actionId ? actionId : "",
        seen_at: null,
        created_at: firebase.firestore.Timestamp.now(),
        last_updated_at: firebase.firestore.Timestamp.now(),
        description: description,
      })
  );
};

export const sendNotificationToLiveUsers = async (
  type,
  description,
  actionId
) => {
  const uid = auth.currentUser.uid;
  let allAdminsIds = [];
  const adminsSnap = await adminRef.where("fcmToken", "!=", null).get();
  await adminsSnap.forEach((adminDoc) => {
    if (
      adminDoc.id !== uid &&
      adminDoc.data().role !== USER_ROLES.GENERAL_MANAGER
    ) {
      allAdminsIds.push(adminDoc.id);
    }
  });

  allAdminsIds.forEach(
    async (adminId) =>
      await notificationsRef.add({
        type: type,
        target_user_id: adminId,
        issuer_user_id: uid,
        id: actionId ? actionId : "",
        seen_at: null,
        created_at: firebase.firestore.Timestamp.now(),
        last_updated_at: firebase.firestore.Timestamp.now(),
        description: description,
      })
  );
};

export const sendNotificationToBasicUsers = async (
  type,
  description,
  actionId,
  location
) => {
  console.log(location);
  const uid = auth.currentUser.uid;
  let allAdminsIds = [];
  const adminsSnap = await adminRef
    .where("role", "==", USER_ROLES.GENERAL_MANAGER)
    .where("location_access", "array-contains", location)
    .get();
  await adminsSnap.forEach((adminDoc) => {
    if (adminDoc.id !== uid) {
      allAdminsIds.push(adminDoc.id);
    }
  });
  allAdminsIds.length > 0 &&
    allAdminsIds.forEach(
      async (adminId) =>
        await notificationsRef.add({
          type: type,
          target_user_id: adminId,
          issuer_user_id: uid,
          id: actionId ? actionId : "",
          seen_at: null,
          created_at: firebase.firestore.Timestamp.now(),
          last_updated_at: firebase.firestore.Timestamp.now(),
          description: description,
        })
    );
};
