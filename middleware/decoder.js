const { verifyJWT } = require('./jwt');
const httpErrors = require('http-errors');

exports.decodeToken = async (req, res, next) => {
  const token = req.cookies.token;

  const decodedToken = await verifyJWT(token);
  if (!decodedToken) return next(new httpErrors(401, 'Invalid token.'));

  return decodedToken;
};
