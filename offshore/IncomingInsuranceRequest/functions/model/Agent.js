const Joi = require("joi");
const { Language, InsuranceType } = require("./DataType");
const moment = require("moment");

const schema = {
  uid: Joi.string().email({ minDomainAtoms: 2 }),
  name: Joi.string()
    .min(2)
    .max(50)
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

module.exports.validateUser = validateUser;
