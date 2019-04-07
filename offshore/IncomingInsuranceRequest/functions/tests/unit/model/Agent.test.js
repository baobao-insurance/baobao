const moment = require("moment");

const admin = require("firebase-admin");
const homedir = require("os").homedir();
var serviceAccount = require(`${homedir}/.ssh/baobao_insurance/baobao-insurance-firebase-adminsdk-o2p8u-01de9d04b9.json`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://baobao-insurance.firebaseio.com/",
  databaseAuthVariableOverride: {
    uid: "my-service-worker"
  }
});
const ALLOW_TIMEOUT = 1000000;

const { InsuranceType, Gender, Language } = require("../../../model/DataType");
const Agent = require("../../../model/Agent");
const { validateUser } = require("../../../model/Agent");

describe("test agent", () => {
  let error;
  let user;

  beforeEach(() => {
    user = {
      email: "abcd@abcd.com",
      name: "小美",
      birth: moment()
        .add(-23, "y")
        .toDate(),
      gender: Gender.FEMALE,
      language: [Language.Cantonese, Language.Mandarin],
      agentLicenseDate: new Date(),
      insurance_type: [InsuranceType.investment, InsuranceType.life]
    };
  });

  it("validate agent", () => {
    user = {
      email: "abcd@abcd",
      name: "小肥",
      birth: moment()
        .add(-18, "y")
        .toDate(),
      language: [Language.Cantonese, Language.Mandarin]
    };
    error = validateUser(user);
    expect(error.error).not.toBeNull();

    user = {
      email: "abcd@abcd.com",
      name: "小肥",
      gender: Gender.MALE,
      birth: moment()
        .add(-16, "y")
        .toDate(),
      language: [Language.Cantonese, Language.Mandarin],
      agentLicenseDate: new Date(),
      insurance_type: [InsuranceType.investment, InsuranceType.life]
    };
    error = validateUser(user);
    expect(error.error).not.toBeNull();
    expect(error.error.details[0].message).toMatch(
      /\"birth\" must be less than/
    );

    user = {
      email: "abcd@abcd.com",
      name: "小肥",
      gender: Gender.MALE,
      birth: moment()
        .add(-19, "y")
        .toDate(),
      language: [Language.Cantonese, Language.Mandarin],
      agentLicenseDate: new Date(),
      insurance_type: [InsuranceType.investment, InsuranceType.life]
    };
    error = validateUser(user);
    expect(error.error).toBeNull();
  });

  it(
    "save agent into Firebase",
    async () => {
      validateUser(user);

      const result = await Agent.save(user);
    },
    ALLOW_TIMEOUT
  );

  it(
    "reject duplicated agent into Firebase",
    async () => {
      let result = await Agent.save(user);
      result = await Agent.insertDoc(user);
    },
    ALLOW_TIMEOUT
  );
});
