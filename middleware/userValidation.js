const httpErrors = require('http-errors');
const asyncHandler = require('../middleware/async');
const { verifyJWT } = require('./jwt');
const { inputsValidation } = require('../utils/inputsValidation');
const { getUserById } = require('../database/models/user');

const decodeToken = async (req, res, next) => {
  const token = req.cookies.token;

  const decodedToken = await verifyJWT(token);
  if (!decodedToken) return next(new httpErrors(401, 'Invalid token.'));

  return decodedToken;
};

exports.isLoggedIn = asyncHandler(async (req, res, next) => {
  if (Object.keys(req.cookies).length === 0)
    return next(new httpErrors(401, 'unauthorized'));

  next();
});

exports.isAmin = asyncHandler(async (req, res, next) => {
  const decodedToken = await decodeToken(req, res, next);

  if (!decodedToken.isAdmin) return next(new httpErrors(403, 'Forbidden'));

  next();
});

exports.acceptIfAuthorized = asyncHandler(async (req, res, next) => {
  const decodedToken = await decodeToken(req, res, next);

  if (isNaN(req.params.userId) || parseInt(req.params.userId) <= 0)
    return next(new httpErrors(400, 'Invalid id.'));

  if (
    !decodedToken.isAdmin &&
    req.params.userId.toString() !== decodedToken.id.toString()
  )
    return next(new httpErrors(403, 'Forbidden.'));

  next();
});

exports.deleteIfValid = asyncHandler(async (req, res, next) => {
  const decodedToken = await decodeToken(req, res, next);

  const user = await getUserById(decodedToken.id);

  if (
    !decodedToken.isAdmin ||
    (decodedToken.isAdmin &&
      user[0].role === 'admin' &&
      user[0].id.toString() === req.params.userId.toString())
  ) {
    res.cookie('token', undefined, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  }
});

exports.updateIfValid = asyncHandler(async (req, res, next) => {
  const { email, name, password } = req.body;

  const hashedPassword = await inputsValidation(email, name, password, next);

  req.user = { email, name, password: hashedPassword };

  next();
});

exports.deleteManyIfValid = asyncHandler(async (req, res, next) => {
  if (!Array.isArray(req.body) || !req.body.length)
    return next(
      new httpErrors(
        400,
        'Data should be in an array and minimum length should be 1'
      )
    );

  req.body.forEach((el) => {
    if (typeof el !== 'number' || el <= 0)
      return next(
        new httpErrors(
          400,
          'Array should be only numbers and should be greater than 0.'
        )
      );
  });

  next();
});
