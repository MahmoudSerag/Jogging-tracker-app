const Joi = require('joi');
const httpErrors = require('http-errors');
const bcrypt = require('bcrypt');

exports.validateInputs = async (email, name, password, next) => {
  const inputs = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string()
      .min(8)
      .max(32)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  });

  const isValid = await inputs.validate({ email, name, password });
  if (isValid.error)
    return next(new httpErrors(400, `Bad request ${isValid.error.message}`));

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
