// At the top of test/index.test.js
const test = require("firebase-functions-test")(
  {
    //databaseURL: "https://baobao-235814.firebaseio.com/",
    //storageBucket: "baobao-235814.appspot.com",
    projectId: "baobao-235814"
  }
  //,"~/.ssh/baobao/baobao-235814-firebase-adminsdk-zyh38-ce8e4f3313.json"
);
const admin = require("firebase-admin");
const homedir = require("os").homedir();
var serviceAccount = require(`${homedir}/.ssh/baobao_insurance/baobao-insurance-firebase-adminsdk-o2p8u-01de9d04b9.json`);

let initialized = false;

if (!initialized) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://baobao-insurance.firebaseio.com/",
    databaseAuthVariableOverride: {
      uid: "my-service-worker"
    }
  });
  initialized = true;
}

module.exports = test;
