const admin = require("firebase-admin");
const firebaseHelper = require("firebase-functions-helper");

const db = admin.firestore();
const DEBUG = require("debug")("app:dev");
function isFunction(f) {
  return typeof f === "function";
}

class FireBaseDao {
  constructor(name, schema, validate, uniqueKey) {
    this.name = name;
    this.schema = schema;
    this.validate = validate;
    this.uniqueKey = uniqueKey;

    this.myCollection = db.collection(name);
  }

  async insertDoc(doc) {
    let key = doc[this.uniqueKey];
    let docRef = this.myCollection.doc(key);
    let Query = this.myCollection.where(this.uniqueKey, "==", key);

    db.runTransaction(tx => {
      return tx.get(docRef).then(queryDoc => {
        DEBUG("run transaction");
        console.log("run transaction");
      });
    });
  }
  async save(doc) {
    let newdoc;
    this.validate(doc);
    try {
      newdoc = await firebaseHelper.firestore.createNewDocument(
        db,
        this.name,
        doc
      );
    } catch (ex) {
      throw ex;
    }
    return newdoc;
  }
}

module.exports.FireBaseDao = FireBaseDao;
