const Joi = require("joi");
const { Language } = require("./DataType");
class User {
  schema = {
    uid: Joi.string().email({ minDomainAtoms: 2 }),
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    birth: Joi.date().greater("now"),
    language: Joi.number()
      .integer()
      .min(1)
      .max(Object.keys(Language).length)
  };
}
