const httpErrors = require('http-errors');
const asyncHandler = require('./async');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { config } = require('../config/env');
const { signIn } = require('../database/models/auth');

exports.registerValidation = asyncHandler(async (req, res, next) => {
  const { email, name, password } = req.body;

  const userValidation = Joi.object({
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

  const isValid = await userValidation.validate({ email, name, password });
  if (isValid.error)
    return next(new httpErrors(400, `Bad request ${isValid.error.message}`));

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  req.user = { password: hashedPassword, name, email };

  next();
});

exports.loginValidation = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let admin = '';

  if (Object.keys(req.cookies).length !== 0)
    return next(new httpErrors(400, `Already logged in.`));

  const user = await signIn(email);

  if (!user.length) return next(new httpErrors(404, 'Invalid credentials.'));

  if (user[0].email === config.adminEmail) admin = true;
  else admin = false;

  const matchPassword = await bcrypt.compare(password, user[0].password);
  if (!matchPassword) return next(new httpErrors(400, 'Invalid credentials.'));

  req.user = {
    email: user[0].email,
    id: user[0].id,
    name: user[0].name,
    password: user[0].password,
    admin: admin,
  };

  next();
});

exports.logoutValidation = asyncHandler(async (req, res, next) => {
  if (!req.cookies.token)
    return next(new httpErrors(400, `Already logged out.`));

  next();
});
