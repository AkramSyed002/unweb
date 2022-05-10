const functions = require("firebase-functions");
var admin = require("firebase-admin");

const cors = require("cors")({ origin: true });

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

exports.createAdmin = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const admin = req.body.data;
    try {
      const userRecord = await auth.createUser({ email: admin.email });
      await db.collection("admin").doc(userRecord.uid).set(admin);
      return res.status(200).send({
        data: {
          status: 200,
          message: "Admin Created",
          userId: userRecord.uid
        },
      });
    } catch (error) {
      functions.logger.error(error);
      return res.status(500).send({
        data: {
          status: 500,
          message: error.message,
        },
      });
    }
  });
});