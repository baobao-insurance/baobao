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
      insurance_type: InsuranceType.investment,
      amount: 1000000,
      agentGender: Gender.ANY,
      agentExp: AgentExp.ANY,
      agentAgeGrp: AgeGrp.E25_30,
      language: [Language.Mandarin]
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

  it("should return query with valid ticket", async () => {
    try {
      await searchIncomingTicket(ticket);
    } catch (ex) {
      //console.log(ex.message);
      expect(ex.message).toMatch(/\"insurance_type\" is required/);
    }
  });
});
