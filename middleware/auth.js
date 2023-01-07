const httpErrors = require('http-errors');
const asyncHandler = require('./async');
const { validateInputs } = require('../utils/inputsValidation');
const bcrypt = require('bcrypt');
const { signIn } = require('../database/models/auth');

exports.registerValidation = asyncHandler(async (req, res, next) => {
  const { email, name, password } = req.body;

  const hashedPassword = await validateInputs(email, name, password, next);

  req.user = { password: hashedPassword, name, email };

  next();
});

exports.loginValidation = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let admin = '';

  if (req.cookies && req.cookies.token)
    return next(new httpErrors(400, `Already logged in.`));

  const user = await signIn(email);

  if (!user.length) {
    return next(new httpErrors(404, 'Invalid credentials.'));
  }

  if (user[0].role === 'admin') admin = true;
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

exports.logoutValidation = asyncHandler((req, res, next) => {
  if (!req.cookies.token)
    return next(new httpErrors(400, `Already logged out.`));

  next();
});
