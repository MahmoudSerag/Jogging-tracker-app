const httpErrors = require('http-errors');
const asyncHandler = require('../middleware/async');
const { signUp } = require('../database/models/auth');
const { createJWT } = require('../utils/jwt');
const { config } = require('../config/env');

exports.register = asyncHandler(async (req, res, next) => {
  const user = await signUp(req.user);

  const token = await createJWT(user[0].id);
  if (!token) return next(new httpErrors(500, 'Server error.'));

  const date = new Date(
    Date.now() + config.cookieExpireIn * 24 * 60 * 60 * 1000
  );

  return res
    .status(201)
    .cookie('token', token, { expires: date, httpOnly: true })
    .json({
      success: true,
      message: 'User created successfully.',
      items: { data: user, token: token },
    });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const date = new Date(
    Date.now() + config.cookieExpireIn * 24 * 60 * 60 * 1000
  );

  const token = await createJWT(user.id, user.admin);
  if (!token) return next(new httpErrors(500, 'Server error.'));

  res
    .status(200)
    .cookie('token', token, {
      expires: date,
      httpOnly: true,
    })
    .json({
      success: true,
      statusCode: 200,
      items: { id: user.id, name: user.name },
    });
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', undefined, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});
