import { auth, firestore, functions, getServerTime, storage } from "./firebase";
import firebase from "firebase/app";
import uuid from "react-uuid";
import { USER_ROLES } from "../constants";

const usersRef = firestore.collection("users");
const accessCodesRef = firestore.collection("access_codes");
const appOptionsRef = firestore.collection("app_options");
const restaurantRef = firestore.collection("restaurants");
const bookingRef = firestore.collection("reservations");
const menuRef = firestore.collection("menu");
const menuItemsRef = firestore.collection("menu_items");
const menuItemsPricingRef = firestore.collection("menu_items_pricing");
const notificationsRef = firestore.collection("notifications");
const adminRef = firestore.collection("admin");
const adminPreferencesRef = firestore.collection("admin_preferences");
const privateSellerRef = firestore.collection("private_cellar_final");

export const updateAdmin = async (adminId, data) =>
  await adminRef.doc(adminId).update(data);

// Firebase Functions
// Create authenticated admin
const createAdmin = functions.httpsCallable("createAdmin");
const deleteMemberProfile = functions.httpsCallable("deleteMemberProfile");
const updateMemberEmail = functions.httpsCallable("updateMemberEmail");

const membershipAnalytics = functions.httpsCallable("membershipAnalytics");
const restaurantAnalytics = functions.httpsCallable("restaurantAnalytics");

// Admin Services
export const getCurrentUser = async () => {
  const uid = auth.currentUser.uid;
  return adminRef.doc(uid).get();
};

export const addNewAdmin = async (admin) => await createAdmin(admin);
export const hardDeleteMember = async (memberId) =>
  await deleteMemberProfile({ memberId });

export const updateMemberProfileEmail = async (memberId, email) =>
  await updateMemberEmail({ memberId, email });

export const getMembershipAnalytics = async () => await membershipAnalytics();
export const getRestaurantAnalytics = async () => await restaurantAnalytics();

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
export const addNewRestaurant = async (restaurant) =>
  await restaurantRef.add({ ...restaurant, userId: auth.currentUser.uid });

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
      phone_number: doc.data().country_code + doc.data().phone_number,
    });
  });

  setMembers(temp);
};

export const checkEmailExists = async (email) => {
  const snap = await usersRef.where("email", "==", email).get();
  return !snap.empty;
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

export const getMemberUserAccessCode = async (id) =>
  await accessCodesRef.where("user_id", "==", id).get();

export const getBookingsByMemberId = async (memberId) =>
  await bookingRef.where("user_id", "==", memberId).get();

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
  delete updatedBooking.allergies;
  delete updatedBooking.dietary_requirements;
  return await bookingRef.doc(updatedBooking.id).update(updatedBooking);
};

export const deleteBooking = async (id) => await bookingRef.doc(id).delete();

export const updateBookingStatus = async (id, status) =>
  await bookingRef.doc(id).update({ status });

export const getMemberBookingsById = async (userId) =>
  await bookingRef.where("user_id", "==", userId).get();

export const getRestaurantBookingsByID = async (restaurantID) => {
  console.log(restaurantID);
  let snapshot;
  if (restaurantID === null) snapshot = await bookingRef.get();
  else
    snapshot = await bookingRef
      .where("restaurant_id", "==", restaurantID)
      .get();
  let tempArray = [];
  let count = 0;
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
        dietary_requirements: memberDoc.data()?.dietary_requirements,
        allergies: memberDoc.data()?.allergies,
      });
      // Add this line as it makes sure that resolve only when loop has completed
      if (count === snapshot.size - 1) resolve(tempArray);
      count++;
    });
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
    try {
      const menuSnap = await menuRef
        .where("restaurant_id", "==", restaurant_id)
        .orderBy("createdAt", "asc")
        .get();
      if (menuSnap.empty) resolve([]);
      menuSnap.forEach(async (menuDocs) => {
        let menuCatArray = [];
        let menuCatSnap = await menuRef
          .doc(menuDocs.id)
          .collection("menu_categories")
          .orderBy("createdAt", "asc")
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
    } catch (error) {
      console.error(error);
    }
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
      if (index === menuItemsSnap.size - 1) resolve(temp);
      index++;
    });
  });
  return bar;
};

export const addMenuSuperCategory = async (category) =>
  await menuRef.add(category);

export const updateMenuSuperCategory = async (menuId, category) =>
  await menuRef.doc(menuId).update(category);

export const deleteMenuSuperCategory = async (menuId) =>
  await menuRef.doc(menuId).delete();

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
  sendNotificationToAllUsers("menu", "has made changes to menu");
};

export const deleteMenuItemsFromCategory = (menuItems) => {
  if (menuItems.length <= 0) return;
  menuItems.forEach(async (el) => {
    try {
      await menuItemsRef.doc(el.menu_item_id).delete();
      await menuItemsPricingRef.doc(el.menu_item_pricing_id).delete();

      sendNotificationToAllUsers("menu", "has made changes to menu");
    } catch (error) {
      console.log("Error deleting menu items and pricing", error.message);
    }
  });
};

export const addMenuItemToCategory = async (menuItem) => {
  let newMenuItem = Object.assign({}, menuItem);

  delete newMenuItem.currency;
  delete newMenuItem.price;
  newMenuItem.createdAt = getServerTime();

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
    sendNotificationToAllUsers("menu", "has made changes to menu");
    resolve(true);
  });
};

export const deleteMenuItem = async (menuItem) => {
  let menuItemCategoryDoc = await menuRef
    .doc(menuItem.super_category_id)
    .collection("menu_categories")
    .doc(menuItem.category_id)
    .get();
  let menu_items = menuItemCategoryDoc.data().menu_items;
  menu_items = menu_items.filter((e) => e !== menuItem.menu_item_id);

  let restaurant = await restaurantRef.doc(menuItem.restaurant_id).get();

  await menuItemsRef.doc(menuItem.menu_item_id).delete();
  await menuItemsPricingRef.doc(menuItem.menu_item_pricing_id).delete();
  await menuRef
    .doc(menuItem.super_category_id)
    .collection("menu_categories")
    .doc(menuItem.category_id)
    .update({ menu_items });

  console.log(
    `has delete ${menuItem.item_name} in ${menuItem.super_category} under ${
      menuItem.category
    } for ${restaurant.data().name}`
  );
  sendNotificationToAllUsers(
    "menu",
    `has delete ${menuItem.item_name} in ${menuItem.super_category} under ${
      menuItem.category
    } for ${restaurant.data().name}`
  );
  return;
};

export const deleteSubCategoryFromMenu = async (superCatId, catId) =>
  await menuRef
    .doc(superCatId)
    .collection("menu_categories")
    .doc(catId)
    .delete();

// Notifications
export const getNotifications = () =>
  new Promise(async (resolve, reject) => {
    const notificationSnap = await notificationsRef
      .where("target_user_id", "==", auth.currentUser.uid)
      .orderBy("created_at", "desc")
      .get();
    if (notificationSnap.empty) resolve([]);
    let temp = [];
    notificationSnap.forEach(async (doc) => {
      if (doc.data().seen_at === null) {
        const userDoc = await adminRef.doc(doc.data().issuer_user_id).get();
        temp.push({
          notificationId: doc.id,
          id: doc.id,
          ...doc.data(),
          user_avatar:
            userDoc.data().photo_url !== undefined
              ? userDoc.data().photo_url
              : "",
          user_name: userDoc.data().first_name + " " + userDoc.data().last_name,
        });
      }
    });
    resolve(temp);
  });

export const updateNotification = async (id, notification) =>
  await notificationsRef.doc(id).update(notification);

export const markAllNotifications = async (notifications) => {
  let seen_at = new Date();
  let counter = 0;
  notifications.forEach(async (el) => {
    await updateNotification(el.notificationId, { seen_at });
    if (counter === notifications.length - 1) return true;
  });
};

export const getNotificationStatusesByID = async (userId) =>
  await adminPreferencesRef.doc(userId).get();

export const updateNotificationStatusesByID = async (userId, doc) =>
  await adminPreferencesRef.doc(userId).update({ statuses: doc });

export const getUserNotificationStatusByID = async (userId) =>
  await adminPreferencesRef.doc(userId).get();

export const updateUserNotificationStatusByID = async (userId, notifications) =>
  await adminPreferencesRef
    .doc(userId)
    .set({ statuses: notifications }, { merge: true });

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
    // if (adminDoc.id !== uid) {
      allAdminsIds.push(adminDoc.id);
    // }
  });

  allAdminsIds.forEach(async (adminId) => {
    await notificationsRef.add({
      type: type,
      target_user_id: adminId,
      issuer_user_id: uid,
      id: actionId ? actionId : "",
      seen_at: null,
      created_at: firebase.firestore.Timestamp.now(),
      last_updated_at: firebase.firestore.Timestamp.now(),
      description: description,
    });
  });
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
      // if (doc.id !== uid) {
        allAdminsIds.push(doc.id);
      // }
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
      // adminDoc.id !== uid &&
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
  const uid = auth.currentUser.uid;
  let allAdminsIds = [];
  const adminsSnap = await adminRef
    .where("role", "==", USER_ROLES.GENERAL_MANAGER)
    .where("location_access", "array-contains", location)
    .get();
  await adminsSnap.forEach((adminDoc) => {
    // if (adminDoc.id !== uid) {
      allAdminsIds.push(adminDoc.id);
    // }
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

export const sendNotificationToMember = async (
  title,
  type,
  description,
  memberId,
  actionId
) =>
  await notificationsRef.add({
    title,
    type: type,
    target_user_id: memberId,
    issuer_user_id: auth.currentUser.uid,
    id: actionId ? actionId : "",
    seen_at: null,
    created_at: firebase.firestore.Timestamp.now(),
    last_updated_at: firebase.firestore.Timestamp.now(),
    description: description,
  });

export const sendNotificationToAllMembers = async (
  title,
  type,
  description,
  actionId
) => {
  const membersSnap = await usersRef.get();
  membersSnap.forEach(async (memberDoc) => {
    await notificationsRef.add({
      title,
      type: type,
      target_user_id: memberDoc.id,
      issuer_user_id: auth.currentUser.uid,
      id: actionId ? actionId : "",
      seen_at: null,
      created_at: firebase.firestore.Timestamp.now(),
      last_updated_at: firebase.firestore.Timestamp.now(),
      description: description,
    });
  });
};

export const addActivityLog = async (memberId, description) =>
  await usersRef.doc(memberId).collection("activity_logs").add({
    issuer_user_id: auth.currentUser.uid,
    created_at: firebase.firestore.Timestamp.now(),
    last_updated_at: firebase.firestore.Timestamp.now(),
    description: description,
  });

export const getActivityLogByID = async (memberId) =>
  new Promise(async (resolve, reject) => {
    const notificationSnap = await usersRef
      .doc(memberId)
      .collection("activity_logs")
      .orderBy("created_at", "desc")
      .get();
    let counter = 0;
    if (notificationSnap.empty) resolve([]);
    let temp = [];
    notificationSnap.forEach(async (doc) => {
      const userDoc = await adminRef.doc(doc.data().issuer_user_id).get();
      temp.push({
        notificationId: doc.id,
        id: doc.id,
        ...doc.data(),
        user_avatar:
          userDoc.data().photo_url !== undefined
            ? userDoc.data().photo_url
            : "",
        user_name: userDoc.data().first_name + " " + userDoc.data().last_name,
      });
      if (counter === notificationSnap.size - 1) resolve(temp);
      counter++;
    });
  });

export const getSectionNotifications = async (type) =>
  new Promise(async (resolve, reject) => {
    const notificationSnap = await notificationsRef
      .where("target_user_id", "==", auth.currentUser.uid)
      .where("type", "==", type)
      .orderBy("created_at", "desc")
      .get();
    let counter = 0;

    if (notificationSnap.empty) resolve([]);
    let temp = [];

    notificationSnap.forEach(async (doc) => {
      if (doc.data().seen_at === null) {
        const userDoc = await adminRef.doc(doc.data().issuer_user_id).get();
        temp.push({
          notificationId: doc.id,
          id: doc.id,
          ...doc.data(),
          user_avatar:
            userDoc.data().photo_url !== undefined
              ? userDoc.data().photo_url
              : "",
          user_name: userDoc.data().first_name + " " + userDoc.data().last_name,
        });
      }

      if (counter === notificationSnap.size - 1) resolve(temp);
      counter++;
    });
  });

export const deleteActivityLog = (memberId, notificationsIds = []) =>
  new Promise(async (resolve, reject) => {
    let counter = 0;
    notificationsIds.forEach(async (id) => {
      try {
        await usersRef
          .doc(memberId)
          .collection("activity_logs")
          .doc(id)
          .delete();
        if (counter === notificationsIds.length - 1) resolve(true);
        counter++;
      } catch (error) {
        console.log("Error Deleting Notifications", error);
        reject(error);
      }
    });
  });

export const getPrivateCellar = async (setState) => {
  const doc = await privateSellerRef.doc("private_cellar").get();
  setState(doc.data().values);
};

export const updatePrivateCellar = async (values) =>
  await privateSellerRef.doc("private_cellar").update({ values });
