const express = require("express");

const router = express.Router();

// Add new contact
router.post("/", (req, res) => {
  firebaseHelper.firestore
    .createNewDocument(db, contactsCollection, req.body)
    .then(doc => res.send("Create a new contact"))
    .catch(ex => res.status(401).send(ex));
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
