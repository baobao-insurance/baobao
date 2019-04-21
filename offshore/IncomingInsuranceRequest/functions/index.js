const firebaseHttpsRequest = require("./startup/firebaseHttpsRequest");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
require("./startup/firebaseInit");

const express = require("express");

const main = express();
require("./startup/logging")();
require("./startup/routes")(main);

module.exports.incomingInsuranceRequest = firebaseHttpsRequest(main);
