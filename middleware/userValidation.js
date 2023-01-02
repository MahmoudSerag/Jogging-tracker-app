const httpErrors = require('http-errors');
const asyncHandler = require('../middleware/async');
const { getUserById } = require('../database/models/user');
const { decodeToken } = require('./decoder');

exports.isLoggedIn = asyncHandler(async (req, res, next) => {
  if (Object.keys(req.cookies).length === 0)
    return next(new httpErrors(401, 'unauthorized'));

  next();
});

exports.isAdmin = asyncHandler(async (req, res, next) => {
  const decodedToken = await decodeToken(req, res, next);

  if (!decodedToken.isAdmin) return next(new httpErrors(403, 'Forbidden'));

  next();
});

exports.acceptIfUserAuthorized = asyncHandler(async (req, res, next) => {
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

  let usersIds = [];
  req.body.forEach((el) => {
    usersIds.push(Math.floor(el));
  });

  const uniqueUsers = [...new Set(usersIds)];

  req.user = { ids: uniqueUsers };

  next();
});
