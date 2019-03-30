const express = require("express");
const firebaseHelper = require("firebase-functions-helper");
const router = express.Router();

const db = require("../startup/firebaseDB");

const contactsCollection = "contacts";

// Add new contact
router.post("/", async (req, res) => {
  let doc;
  try {
    doc = await firebaseHelper.firestore.createNewDocument(
      db,
      contactsCollection,
      req.body
    );
  } catch (ex) {
    res.status(401).send(ex);
  }
  res.status(200).send(doc);
});

// Update new contact
router.patch("/:contactId", (req, res) => {
  firebaseHelper.firestore.updateDocument(
    db,
    contactsCollection,
    req.params.contactId,
    req.body
  );
  res.send("Update a new contact");
});

// View a contact
router.get("/:contactId", (req, res) => {
  firebaseHelper.firestore
    .getDocument(db, contactsCollection, req.params.contactId)
    .then(doc => res.status(200).send(doc))
    .catch(err => console.log("error", err));
});

// View all contacts
router.get("/", (req, res) => {
  firebaseHelper.firestore
    .backup(db, contactsCollection)
    .then(data => res.status(200).send(data))
    .catch(err => console.log(err));
});

// Delete a contact
router.delete("/:contactId", (req, res) => {
  firebaseHelper.firestore.deleteDocument(
    db,
    contactsCollection,
    req.params.contactId
  );
  res.send("Contact is deleted");
});

module.exports = router;
