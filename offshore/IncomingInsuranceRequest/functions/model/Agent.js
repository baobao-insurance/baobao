const Joi = require("joi");
const { Language, InsuranceType, Gender } = require("./DataType");
const moment = require("moment");
const DEBUG = require("debug")("app:dev");
const { FireBaseDao } = require("../startup/firebaseDB");

const schema = {
  email: Joi.string().email({ minDomainAtoms: 2 }),
  name: Joi.string()
    .min(2)
    .max(50)
    .required(),
  gender: Joi.number()
    .integer()
    .min(1)
    .max(Object.keys(Gender).length)
    .required(),
  birth: Joi.date().max(
    moment()
      .add(-18, "y")
      .toDate()
  ),
  language: Joi.array()
    .min(1)
    .max(Object.keys(Language).length)
    .required(),
  agentLicenseDate: Joi.date().max("now"),
  insurance_type: Joi.array()
    .min(1)
    .max(Object.keys(InsuranceType).length)
    .required()
};

validateUser = user => {
  return Joi.validate(user, schema);
};

const Agent = new FireBaseDao("Agent", schema, validateUser, "email");

module.exports = Agent;
module.exports.validateUser = validateUser;
