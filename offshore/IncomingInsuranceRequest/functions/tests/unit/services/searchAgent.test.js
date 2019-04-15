require("../../firebaseTestObj");
const searchIncomingTicket = require("../../../services/searchAgent");
const uuidv4 = require("uuid/v4");
const {
  Gender,
  InsuranceType,
  AgeGrp,
  AgentExp,
  Language
} = require("../../../model/DataType");
describe("test agent", () => {
  let error;
  let ticket;

  beforeEach(() => {
    ticket = {
      uid: uuidv4().toString(),
      insurance_type: InsuranceType.medical,
      amount: 1000000,
      agentGender: Gender.ANY,
      agentExp: AgentExp.ANY,
      agentAgeGrp: AgeGrp.ANY,
      language: Language.Mandarin
    };
  });

  it("should return error if given invalid ticket", async () => {
    delete ticket.amount;
    delete ticket.insurance_type;
    try {
      await searchIncomingTicket(ticket);
      throw new Error("insurance_type is missing");
    } catch (ex) {
      //console.log(ex.message);
      expect(ex.message).toMatch(/\"insurance_type\" is required/);
    }
  });

  it("should return query with valid gender + insurance type", async () => {
    ticket.agentGender = Gender.FEMALE;
    const agents = await searchIncomingTicket(ticket);
    expect(agents.length).toBe(0);
  });

  it("should return query with valid gender + insurance type + lang", async () => {
    ticket.agentGender = Gender.MALE;
    ticket.agentAgeGrp = AgeGrp.E25_30;
    const agents = await searchIncomingTicket(ticket);
    expect(agents.length).toBe(1);
  });
});
