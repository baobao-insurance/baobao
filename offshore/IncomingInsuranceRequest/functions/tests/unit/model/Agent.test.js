const moment = require("moment");
const { validateUser } = require("../../../model/Agent");
const {
  AgentGender,
  InsuranceType,
  AgeGrp,
  AgentExp,
  Language
} = require("../../../model/DataType");
describe("test agent", () => {
  let error;
  it("validate agent", () => {
    let user = {
      uid: "abcd@abcd",
      name: "小肥",
      birth: moment()
        .add(-18, "y")
        .toDate(),
      language: [Language.Cantonese, Language.Mandarin]
    };
    error = validateUser(user);
    expect(error.error).not.toBeNull();

    user = {
      uid: "abcd@abcd.com",
      name: "小肥",
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
      uid: "abcd@abcd.com",
      name: "小肥",
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
});
