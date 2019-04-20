require("../../firebaseTestObj");
const moment = require("moment");
const DEBUG = require("debug")("app:dev");

const ALLOW_TIMEOUT = 1000000;

const { InsuranceType, Gender, Language } = require("../../../model/DataType");
const Agent = require("../../../model/Agent");
const { validateUser } = require("../../../model/Agent");

describe("test agent", () => {
  let error;
  let user;
  let userList;

  beforeAll(() => {
    userList = [
      {
        email: "siumei@abcd.com",
        name: "小美",
        birth: moment()
          .add(-23, "y")
          .toDate(),
        gender: Gender.FEMALE,
        language: [Language.Cantonese, Language.Mandarin],
        agentLicenseDate: moment()
          .add(-3, "y")
          .toDate(),
        insurance_type: [InsuranceType.investment, InsuranceType.life]
      },
      {
        email: "siukoeng@abcd.com",
        name: "小強",
        birth: moment()
          .add(-29, "y")
          .toDate(),
        gender: Gender.MALE,
        language: [Language.Cantonese, Language.Mandarin],
        agentLicenseDate: moment()
          .add(-11, "y")
          .toDate(),
        insurance_type: [InsuranceType.life, InsuranceType.medical]
      },
      {
        email: "littlefish@abcd.com",
        name: "小魚",
        birth: moment()
          .add(-20, "y")
          .toDate(),
        gender: Gender.FEMALE,
        language: [Language.Mandarin],
        agentLicenseDate: moment()
          .add(-1, "y")
          .toDate(),
        insurance_type: [InsuranceType.investment]
      }
    ];
  });
  beforeEach(() => {
    user = {
      email: "abcd@abcd.com",
      name: "小花",
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
    expect(error.error.details[0].message).toMatch(/"birth" must be less than/);

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
  it("should return error if given invalid agent", async () => {
    delete user.email;
    try {
      const result = await Agent.insert(user);
      throw new Error("email is missing");
    } catch (ex) {
      expect(ex.message).toMatch(/"email" is required/);
    }
  });

  it(
    "save agent into Firebase",
    async () => {
      const result = await Agent.insert(user);
      //console.log(result);

      const queryUser = await Agent.queryByField(
        Agent.uniqueKey,
        user[Agent.uniqueKey]
      );
      expect(queryUser).not.toBeNull();
      expect(queryUser.length).toBe(1);

      //console.log(Agent.getHashKey(user.email));
    },
    ALLOW_TIMEOUT
  );

  it(
    "qunery agent from Firebase",
    async () => {
      const queryUser = await Agent.getDoc(user.email);
      expect(queryUser).not.toBeNull();
    },
    ALLOW_TIMEOUT
  );

  it(
    "save agents into Firebase",
    async () => {
      /*
      await userList.map(
        u =>
          new Promise(async (resolve, reject) => {
            try {
              const result = await Agent.insert(user);
              console.log(result);
              resolve(result);
            } catch (ex) {
              reject(ex.message);
            }
          })
      );*/
      /*
      const agentsPromise = await Promise.all(
        Array(parseInt(userList.length))
          .fill()
          .map(async (element, index) => {
            //console.log(userList[index].name, " begin");
            await Agent.insert(userList[index]);
            //console.log(userList[index].name, " done");
          })
      );*/

      const agentsPromise2 = await Promise.all(
        userList.map(async element => {
          //console.log(element.name, " begin");
          await Agent.insert(element);
          //console.log(element.name, " done");
        })
      );

      //const result = await Agent.insert(user);
      /*
      const queryUser = await Agent.queryByField(
        Agent.uniqueKey,
        user[Agent.uniqueKey]
      );
      expect(queryUser).not.toBeNull();
      expect(queryUser.length).toBe(1);*/

      //console.log(Agent.getHashKey(user.email));
    },
    ALLOW_TIMEOUT
  );

  /*
  it(
    "reject duplicated agent into Firebase",
    async () => {
      let result = await Agent.save(user);
      DEBUG("run insert Doc");
      //https://bigcodenerd.org/enforce-cloud-firestore-unique-field-values/
      result = await Agent.insertDoc(user);
    },
    ALLOW_TIMEOUT
  );*/
});
