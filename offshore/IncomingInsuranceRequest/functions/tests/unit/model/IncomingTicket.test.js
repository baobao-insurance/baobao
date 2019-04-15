const { validateIncomingTicket } = require("../../../model/IncomingTicket");
const uuidv4 = require("uuid/v4");
const {
  Gender,
  InsuranceType,
  AgeGrp,
  AgentExp,
  Language
} = require("../../../model/DataType");

describe("Test incoming ticket", () => {
  let error;
  it("validate IncomingTicket", () => {
    //ticket = new IncomingTicket();

    let ticket = {
      uid: "^^^",
      insurance_type: InsuranceType.investment,
      amount: 1000000,
      agentGender: Gender.ANY,
      agentExp: AgentExp.ANY,
      agentAgeGrp: AgeGrp.E25_30,
      language: Language.Cantonese
    };
    error = validateIncomingTicket(ticket);
    expect(error.error).toBeDefined();

    ticket = {
      insurance_type: InsuranceType.investment,
      amount: 1000000,
      agentGender: Gender.ANY,
      agentExp: AgentExp.ANY,
      agentAgeGrp: AgeGrp.E25_30,
      language: Language.Cantonese
    };
    error = validateIncomingTicket(ticket);
    expect(error.error).not.toBeNull();

    ticket = {
      uid: uuidv4().toString(),
      insurance_type: InsuranceType.investment,
      amount: 1000000,
      agentGender: Gender.ANY,
      agentExp: AgentExp.ANY,
      agentAgeGrp: AgeGrp.ANY,
      language: Language.Mandarin
    };

    error = validateIncomingTicket(ticket);
    expect(error.error).toBeNull();
  });
});
