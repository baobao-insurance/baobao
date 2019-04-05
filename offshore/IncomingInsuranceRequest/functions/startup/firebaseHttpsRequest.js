const functions = require("firebase-functions");

module.exports = app => {
  return functions.https.onRequest(app);
};
