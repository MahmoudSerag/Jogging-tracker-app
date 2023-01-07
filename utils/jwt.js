const jwt = require('jsonwebtoken');
const { config } = require('../config/env');

exports.createJWT = async function (userId, admin) {
  return jwt.sign(
    { id: userId, isAdmin: admin },
    config.JWT_privateKey,
    { algorithm: 'HS512' },
    { expiresIn: config.JwtExpire }
  );
};

exports.verifyJWT = async function (token) {
  return jwt.verify(token, config.JWT_privateKey);
};
