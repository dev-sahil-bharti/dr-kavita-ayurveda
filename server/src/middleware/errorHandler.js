const AppError = require('../utils/AppError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    console.error('ERROR 💥', err);
    try { require('fs').writeFileSync('error_log.txt', err.stack); } catch(e){}
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message, name: err.name };

    // Handle specific DB errors here if needed
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProd(error, res);
  }
};
