exports.errorHandler = (err, req, res) => {
  let error = { ...err };

  error.message = err.message;
  error.statusCode = err.statusCode;

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    error: error.message || 'Server Error',
  });
};
