const { validateIncomingTicket } = require("../model/IncomingTicket");
const moment = require("moment");
const Agent = require("../model/Agent");
const debug = require("debug")("app:DEBUG");
const {
  Gender,
  InsuranceType,
  AgeGrp,
  AgentExp,
  Language
} = require("../model/DataType");

const searchIncomingTicket = async ticket => {
  let err;
  err = validateIncomingTicket(ticket);
  if (err.error !== null) {
    throw new Error(err.error);
  }

  //1, ticket insurance_type
  let query = Agent.prepareQuery(
    "insurance_type",
    "array-contains",
    ticket.insurance_type
  );

  //2, agent prefered gender
  if (ticket.agentGender > Gender.ANY) {
    query = Agent.prepareQuery("gender", "==", ticket.agentGender, query);
  }

  //3. agent age group
  if (ticket.agentAgeGrp > AgeGrp.ANY) {
    let min = 0;
    let max = 0;
    switch (ticket.agentAgeGrp) {
      case AgeGrp.E18_25:
        min = 18;
        max = 25;
        break;
      case AgeGrp.E25_30:
        min = 25;
        max = 30;
        break;
      case AgeGrp.E30_40:
        min = 30;
        max = 40;
        break;
      case AgeGrp.E40:
        min = 40;
        max = 100;
        break;
      default:
    }
    query = Agent.prepareQuery(
      "birth",
      "<=",
      moment()
        .add(-1 * min, "y")
        .toDate(),
      query
    );
    query = Agent.prepareQuery(
      "birth",
      ">",
      moment()
        .add(-1 * max, "y")
        .toDate(),
      query
    );
  }
  let docList = await Agent.executeQuery(query);

  docList.map(x => {
    x.birth = x.birth.toDate();
    x.agentLicenseDate = x.agentLicenseDate.toDate();
    return x;
  });

  //filtering by rest of the fields: experience and language
  //4. agent exp
  //debug("ticket.language" + ticket.language);
  if (ticket.language !== Language.ANY) {
    //debug("entering the lauguage selection");
    docList = docList.filter(x => x.language.includes(ticket.language));
    //debug(docList);
  }

  if (ticket.agentExp > AgentExp.ANY) {
    docList = docList.filter(x => {
      let min = 0;
      let max = 0;
      switch (ticket.agentExp) {
        case AgentExp.E2Y_5Y:
          min = 2;
          max = 5;
          break;
        case AgentExp.E5Y_10Y:
          min = 5;
          max = 10;
          break;
        case AgentExp.E10Y:
          min = 10;
          max = 100;
          break;

        default:
      }

      return (
        moment()
          .add(-1 * min, "y")
          .toDate() >= x.agentLicenseDate &&
        x.agentLicenseDate >
          moment()
            .add(-1 * max, "y")
            .toDate()
      );
    });
  }

  //console.log(docList);
  return docList;
};

module.exports = searchIncomingTicket;
