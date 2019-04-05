const admin = require("firebase-admin");

const testEnv = require("../../firebaseTestObj");
const homedir = require("os").homedir();
const ALLOW_TIMEOUT = 1000000;
describe("Test User Auth", () => {
  let adminStub, api;

  beforeAll(() => {
    // you can use `sinon.stub` instead
    // Initialize the app with a custom auth variable, limiting the server's access
    var serviceAccount = require(`${homedir}/.ssh/baobao/baobao-235814-firebase-adminsdk-zyh38-ce8e4f3313.json`);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://baobao-235814.firebaseio.com/",
      databaseAuthVariableOverride: {
        uid: "my-service-worker"
      }
    });

    adminStub = jest.spyOn(admin, "initializeApp");

    // after initializeApp call, we load our functions
    api = require("../../../trigger/userauth");
    //console.log(api);
  });

  afterAll(() => {
    // clean things up
    adminStub.mockRestore();
    testEnv.cleanup();

    // reset our database

    admin
      .database()
      .ref("users")
      .remove();
  });

  it(
    "should store user in db on GoogleOAuth",
    async () => {
      const wrapped = testEnv.wrap(api.onUserCreate);

      const testUser = {
        uid: "122",
        displayName: "lee"
      };

      // wrap your `onUserCreate` method and pass parameter: user
      // for the sake of brevity, I omitted other `UserRecord` properties.
      // you can check https://firebase.google.com/docs/reference/js/firebase.User for more information
      await wrapped(testUser);

      // we read our user from database
      const createdUser = await admin
        .database()
        .ref(`/users/${testUser.uid}`)
        .once("value");

      // we expect our newly created user to have zero points
      expect(createdUser.val()).toHaveProperty("points", 0);
    },
    ALLOW_TIMEOUT
  );
});
