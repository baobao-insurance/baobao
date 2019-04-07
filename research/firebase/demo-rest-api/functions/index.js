const firebaseHttpsRequest = require("./startup/firebaseHttpsRequest");
//Reference
// https://itnext.io/building-a-serverless-restful-api-with-cloud-functions-firestore-and-express-f917a305d4e6

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
require("./startup/firebaseInit");

const express = require("express");
const bodyParser = require("body-parser");

const contact = require("./routes/contact");

const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
main.use("/api/v1/contacts", contact);

module.exports.webApi = firebaseHttpsRequest(main);
