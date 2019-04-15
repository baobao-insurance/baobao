const admin = require("firebase-admin");
const createHash = require("keccak");
const firebaseHelper = require("firebase-functions-helper");

const db = admin.firestore();
const DEBUG = require("debug")("app:dev");
function isFunction(f) {
  return typeof f === "function";
}
const isHex = str => {
  if (str.length % 2 === 0 && str.match(/^[0-9a-f]+$/i)) return true;
  return false;
};
const isBase64 = str => {
  var index;
  if (str.length % 4 > 0 || str.match(/[^0-9a-z+\/=]/i)) return false;
  index = str.indexOf("=");
  if (index === -1 || str.slice(index).match(/={1,2}/)) return true;
  return false;
};

const str2buf = (str, enc) => {
  if (!str || str.constructor !== String) return str;
  if (!enc && isHex(str)) enc = "hex";
  if (!enc && isBase64(str)) enc = "base64";
  return Buffer.from(str, enc);
};

class FireBaseDao {
  constructor(name, schema, validate, uniqueKey) {
    this.name = name;
    this.schema = schema;
    this.validate = validate;
    this.uniqueKey = uniqueKey;

    this.docRef = db.collection(this.name);
  }

  getHashKey(keyValue) {
    const buffer = str2buf(keyValue);
    return createHash("keccak256")
      .update(buffer)
      .digest()
      .toString("hex");
  }

  async insert(doc) {
    let newdoc;
    const err = this.validate(doc);
    //console.log(err.error);
    if (err.error != null) {
      throw new Error(err.error);
    }
    let key = this.getHashKey(doc[this.uniqueKey]);

    const res = this.docRef.doc(key).set(doc);

    return res;
  }

  async getDoc(key) {
    const hashKey = this.getHashKey(key);
    this.getDocByHashedKey(hashKey);
  }
  async getDocByHashedKey(hashkey) {
    let Query = this.docRef.doc(hashkey);

    try {
      const doc = await Query.get();
      if (doc.exists) {
        return doc.data();
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async queryByField(field, value) {
    let Query = this.docRef.where(field, "==", value);
    //console.log("queryByField");
    const docList = [];
    try {
      const querySnapshot = await Query.get();
      querySnapshot.forEach(doc => docList.push(doc.data()));
    } catch (error) {
      throw new Error(error);
    }
    return docList;
  }

  prepareQuery(field, operator, value, ChainQuery) {
    if (ChainQuery == null) {
      return this.docRef.where(field, operator, value);
    } else {
      return ChainQuery.where(field, operator, value);
    }
  }
  async executeQuery(query) {
    const docList = [];
    try {
      const querySnapshot = await query.get();
      if (querySnapshot != null)
        querySnapshot.forEach(doc => docList.push(doc.data()));
    } catch (error) {
      throw new Error(error);
    }
    return docList;
  }
}

module.exports.FireBaseDao = FireBaseDao;
