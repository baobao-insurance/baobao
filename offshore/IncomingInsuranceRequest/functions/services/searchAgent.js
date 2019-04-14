const { validateIncomingTicket } = require("../model/IncomingTicket");
const Agent = require("../model/Agent");

const searchIncomingTicket = async ticket => {
  let err;
  err = validateIncomingTicket(ticket);
  if (err.error != null) {
    throw new Error(err.error);
  }

  //1, ticket insurance_type
  let query = Agent.prepareQuery(
    "insurance_type",
    "array-contains",
    ticket.insurance_type
  );

  const docList = await Agent.executeQuery(query);
};

module.exports = searchIncomingTicket;
