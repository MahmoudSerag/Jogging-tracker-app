const httpErrors = require('http-errors');

exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Mongoose bad ObjectId
  // if (err.name === 'CastError') {
  //   const message = `Invalid id.`;
  //   error = new httpErrors(404, message);
  // }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};
