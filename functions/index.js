const functions = require("firebase-functions");
var admin = require("firebase-admin");

const cors = require("cors")({ origin: true });

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

exports.createAdmin = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const admin = req.body.data;
    functions.logger.info(error);
    try {
      const userRecord = await auth.createUser({
        email: admin.email,
        password: admin.otp,
      });

      await db.collection("admin").doc(userRecord.uid).set(admin);
      await db
        .collection("admin_preferences")
        .doc(userRecord.uid)
        .set({
          fcmToken: null,
          statuses: [
            {
              title: "New reservation made",
              value: false,
              visibility: true,
              type: "sms",
            },
            {
              title: "New/ pending reservation requiring attention",
              value: false,
              visibility: true,
              type: "sms",
            },
            {
              title: "Existing reservation requiring attention",
              value: false,
              visibility: true,
              type: "sms",
            },
            {
              title: "Reservation reminder",
              value: false,
              visibility: true,
              type: "sms",
            },
            {
              title: "Reservation cancelled",
              value: false,
              visibility: true,
              type: "sms",
            },
            {
              title: "Member did not show",
              value: false,
              visibility: true,
              type: "sms",
            },
            {
              title: "Reserved member nearing location",
              value: false,
              visibility: true,
              type: "sms",
            },
            {
              title: "Member settings edited",
              value: false,
              visibility: true,
              type: "sms",
            },
            {
              title: "Member profile edited",
              value: false,
              visibility: true,
              type: "sms",
            },
            {
              title: "Member account deleted",
              value: false,
              visibility: true,
              type: "sms",
            },
            {
              title: "Forgot password to be reset",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Password has been reset",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "New reservation made",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "New/ pending reservation requiring attention",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Existing reservation requiring attention",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Reservation reminder",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Reservation cancelled",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Member did not show",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Reserved member nearing location",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Member settings edited",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Member profile edited",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Member account deleted",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Member account deleted",
              value: false,
              visibility: true,
              type: "email",
            },
            {
              title: "Forgot password to be reset",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "Password has been reset",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "New reservation made",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "New/ pending reservation requiring attention",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "Existing reservation requiring attention",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "Reservation reminder",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "Reservation cancelled",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "Member did not show",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "Reserved member nearing location",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "Member settings edited",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "Member profile edited",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "Member account deleted",
              value: false,
              visibility: true,
              type: "in_app",
            },
            {
              title: "Member account deleted",
              value: false,
              visibility: true,
              type: "in_app",
            },
          ],
        });
      return res.status(200).send({
        data: {
          status: 200,
          message: "Admin Created",
          userId: userRecord.uid,
        },
      });
    } catch (error) {
      functions.logger.error(error);
      return res.status(404).send({
        data: {
          status: 404,
          message: error,
        },
      });
    }
  });
});

exports.deleteMemberProfile = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { memberId } = req.body.data;
    functions.logger.error('Member ID:',memberId);
    try {
      // Get access code from where we check if user has authenticated or not yet
      // If Authenticated then delete user from Firebase Authentication as well
      let accessCodeDoc = null;
      const querySnap = await db.collection('access_codes').where('user_id', '==', memberId).get();
      querySnap.forEach(doc => accessCodeDoc = { id: doc.id, ...doc.data() });

      // If is used it means authenticated user so delete it from auth
      functions.logger.error('Member is used status:',accessCodeDoc.is_used);
      if (accessCodeDoc.is_used) {
        functions.logger.error("Member is Authenticated");
        // Delete from auth
        await auth.deleteUser(memberId);
      }
      // Delete access code
      await db.collection("access_codes").doc(accessCodeDoc.id).delete();
      // Delete from firestore
      await db.collection("users").doc(memberId).delete();

      return res.status(200).send({
        data: {
          status: 200,
          message: "Member profile deleted",
        },
      });
    } catch (error) {
      functions.logger.error(error);
      return res.status(404).send({
        data: {
          status: 404,
          message: error,
        },
      });
    }
  });
});
