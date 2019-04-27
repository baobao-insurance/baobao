const Joi = require("joi");
const {
  Gender,
  InsuranceType,
  AgentExp,
  AgeGrp,
  Language
} = require("./DataType");

const schema = {
  uid: Joi.string()
    .regex(/^[a-z|0-9|\-_]+$/i)
    .required(),
  insurance_type: Joi.string().required(),
  amount: Joi.number()
    .greater(0)
    .required(),
  agentGender: Joi.string().required(),
  agentExp: Joi.number()
    .integer()
    .min(AgentExp.ANY)
    .max(Object.keys(AgentExp).length)
    .required(),
  agentAgeGrp: Joi.number()
    .integer()
    .min(0)
    .max(Object.keys(AgeGrp).length)
    .required(),
  language: Joi.string().required()
};

validateIncomingTicket = ticket => {
  return Joi.validate(ticket, schema);
};

module.exports.validateIncomingTicket = validateIncomingTicket;
