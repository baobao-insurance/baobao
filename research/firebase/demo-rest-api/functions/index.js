const functions = require("firebase-functions");
//Reference
// https://itnext.io/building-a-serverless-restful-api-with-cloud-functions-firestore-and-express-f917a305d4e6

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");
const firebaseHelper = require("firebase-functions-helper");
const express = require("express");
const bodyParser = require("body-parser");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

const contactsCollection = "contacts";

module.exports.webApi = functions.https.onRequest(main);

// Add new contact
app.post("/contacts", (req, res) => {
  firebaseHelper.firestore
    .createNewDocument(db, contactsCollection, req.body)
    .then(doc => res.send("Create a new contact"))
    .catch(ex => res.status(401).send(ex));
});

// Update new contact
app.patch("/contacts/:contactId", (req, res) => {
  firebaseHelper.firestore.updateDocument(
    db,
    contactsCollection,
    req.params.contactId,
    req.body
  );
  res.send("Update a new contact");
});

// View a contact
app.get("/contacts/:contactId", (req, res) => {
  firebaseHelper.firestore
    .getDocument(db, contactsCollection, req.params.contactId)
    .then(doc => res.status(200).send(doc))
    .catch(err => console.log("error", err));
});

// View all contacts
app.get("/contacts", (req, res) => {
  firebaseHelper.firestore
    .backup(db, contactsCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.log(err));
});

// Delete a contact
app.delete("/contacts/:contactId", (req, res) => {
  firebaseHelper.firestore.deleteDocument(
    db,
    contactsCollection,
    req.params.contactId
  );
  res.send("Contact is deleted");
});
