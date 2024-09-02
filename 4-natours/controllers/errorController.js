const AppError = require('./../utils/appError');



const handleDuplicateFieldsDB = (err) => {
  const regex = /dup key: \{ \w+: "(.*?)" \}/;
  const match = err.errorResponse.errmsg.match(regex)[1];
  console.log(err);
  const message = `Duplicate field value: ${match}. Please use another value!`;
  return new AppError(message, 400);
};



const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};



const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};



const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err.value);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log(err.name);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV?.trim() === 'production') {
    let error = {
      name: err.name,
      message: err.message,
      stack: err.stack,
      ...err
    };
    console.log(error.name); // This should correctly log the name property

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
