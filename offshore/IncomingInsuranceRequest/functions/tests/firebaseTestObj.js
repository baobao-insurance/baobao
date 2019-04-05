// At the top of test/index.test.js
const test = require("firebase-functions-test")(
  {
    //databaseURL: "https://baobao-235814.firebaseio.com/",
    //storageBucket: "baobao-235814.appspot.com",
    projectId: "baobao-235814"
  }
  //,"~/.ssh/baobao/baobao-235814-firebase-adminsdk-zyh38-ce8e4f3313.json"
);

module.exports = test;
