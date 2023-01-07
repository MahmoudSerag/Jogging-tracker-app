const asyncHandler = require('./async');
const httpErrors = require('http-errors');
const { validInputs } = require('../utils/joggingValidation');
const { decodeToken } = require('./decoder');
const { getTimeZone } = require('../utils/localTimeZone');
const { getJoggingById } = require('../database/models/jogging');

const ifAuthorized = async (decodedToken, filteredArray, next) => {
  if (!decodedToken.isAdmin) {
    if (typeof filteredArray[0] !== 'object') {
      for (let i = 0; i < filteredArray.length; i++) {
        const jogging = await getJoggingById(filteredArray[i]);
        if (jogging.length) {
          if (jogging[0].user_id !== decodedToken.id)
            return next(new httpErrors(403, 'Forbidden.'));
        } else
          return next(
            new httpErrors(404, `id: ${filteredArray[i]} Not Found.`)
          );
      }
    } else {
      for (let i = 0; i < filteredArray.length; i++) {
        const jogging = await getJoggingById(filteredArray[i].id);
        if (jogging.length) {
          if (jogging[0].user_id !== decodedToken.id)
            return next(new httpErrors(403, 'Forbidden.'));
        } else
          return next(
            new httpErrors(404, `id: ${filteredArray[i].id} Not Found.`)
          );
      }
    }
  }
};

exports.validateJogging = asyncHandler(async (req, res, next) => {
  const token = await decodeToken(req, res, next);

  const { distance, time } = req.body;

  await validInputs(req.body, next);

  const currentTime = await getTimeZone(time);

  req.user = { id: token.id, time: currentTime, distance };

  next();
});

exports.acceptIfAuthorizedForJogging = asyncHandler(async (req, res, next) => {
  const decodedToken = await decodeToken(req, res, next);

  if (isNaN(req.params.id) || parseInt(req.params.id) <= 0)
    return next(new httpErrors(400, 'Invalid id.'));

  const jogging = await getJoggingById(req.params.id);

  if (!jogging.length) return next(new httpErrors(404, 'Jogging Not Found.'));

  if (
    !decodedToken.isAdmin &&
    decodedToken.id.toString() !== jogging[0].user_id.toString()
  )
    return next(new httpErrors(403, 'Forbidden.'));

  next();
});

exports.deleteManyIfValid = asyncHandler(async (req, res, next) => {
  const decodedToken = await decodeToken(req, res, next);

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

  const ids = req.body;

  // Remove decimal numbers
  const length = ids.length;
  for (let i = length - 1; i >= 0; i--) {
    ids.push(Math.floor(ids[i]));
    ids.splice(i, 1);
  }

  // Remove duplicated elements
  const filteredIds = [...new Set(ids)];

  ifAuthorized(decodedToken, filteredIds, next);

  req.user = {
    ids: filteredIds,
    admin: decodedToken.isAdmin,
    userId: decodedToken.id,
  };

  next();
});

exports.updateManyIfValid = asyncHandler(async (req, res, next) => {
  const decodedToken = await decodeToken(req, res, next);

  await validInputs(req.body, next);

  const time = await getTimeZone(req.body);

  ifAuthorized(decodedToken, req.body, next);

  req.user = { body: req.body, time };

  next();
});
