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
    .regex(/^[a-z|0-9|\-\_]+$/i)
    .required(),
  insurance_type: Joi.number()
    .integer()
    .min(1)
    .max(Object.keys(InsuranceType).length)
    .required(),
  amount: Joi.number()
    .greater(0)
    .required(),
  agentGender: Joi.number()
    .integer()
    .min(0)
    .max(Object.keys(Gender).length)
    .required(),
  agentExp: Joi.number()
    .integer()
    .min(1)
    .max(Object.keys(AgentExp).length)
    .required(),
  agentAgeGrp: Joi.number()
    .integer()
    .min(1)
    .max(Object.keys(AgeGrp).length)
    .required(),
  language: Joi.array()
    .min(1)
    .max(Object.keys(Language).length)
    .required()
};

validateIncomingTicket = ticket => {
  return Joi.validate(ticket, schema);
};

module.exports.validateIncomingTicket = validateIncomingTicket;
