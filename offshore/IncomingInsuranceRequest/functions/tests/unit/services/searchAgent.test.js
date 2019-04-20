require("../../firebaseTestObj");
const searchIncomingTicket = require("../../../services/searchAgent");
const uuidv4 = require("uuid/v4");

const ALLOW_TIMEOUT = 1000000;
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

  it(
    "should return error if given invalid ticket",
    async () => {
      delete ticket.amount;
      delete ticket.insurance_type;
      try {
        await searchIncomingTicket(ticket);
        throw new Error("insurance_type is missing");
      } catch (ex) {
        //console.log(ex.message);
        expect(ex.message).toMatch(/"insurance_type" is required/);
      }
    },
    ALLOW_TIMEOUT
  );

  it(
    "should return query with valid gender + insurance type",
    async () => {
      ticket.agentGender = Gender.FEMALE;
      const agents = await searchIncomingTicket(ticket);
      expect(agents.length).toBe(0);
    },
    ALLOW_TIMEOUT
  );

  it(
    "should return nothing with valid gender + insurance type + lang",
    async () => {
      ticket.agentGender = Gender.MALE;
      ticket.agentAgeGrp = AgeGrp.E25_30;
      ticket.language = Language.English;
      const agents = await searchIncomingTicket(ticket);
      //console.log(agents);
      expect(agents.length).toBe(0);
    },
    ALLOW_TIMEOUT
  );

  it(
    "should return nothing with valid gender + insurance type + lang +exp",
    async () => {
      ticket.agentGender = Gender.MALE;
      ticket.agentAgeGrp = AgeGrp.E25_30;
      ticket.language = Language.ANY;
      ticket.agentExp = AgentExp.E2Y_5Y;
      const agents = await searchIncomingTicket(ticket);
      //console.log(agents);
      expect(agents.length).toBe(0);
    },
    ALLOW_TIMEOUT
  );
  it(
    "should return query with valid gender + insurance type + lang +exp",
    async () => {
      ticket.agentGender = Gender.MALE;
      ticket.agentAgeGrp = AgeGrp.E25_30;
      ticket.language = Language.ANY;
      ticket.agentExp = AgentExp.E10Y;
      const agents = await searchIncomingTicket(ticket);
      //console.log(agents);
      expect(agents.length).toBe(1);
    },
    ALLOW_TIMEOUT
  );
  it(
    "should return query with valid gender + insurance type + lang",
    async () => {
      ticket.agentGender = Gender.MALE;
      ticket.agentAgeGrp = AgeGrp.E25_30;
      const agents = await searchIncomingTicket(ticket);
      expect(agents.length).toBe(1);
    },
    ALLOW_TIMEOUT
  );
});
