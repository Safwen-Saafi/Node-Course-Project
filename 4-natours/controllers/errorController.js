const AppError = require('./../utils/appError');


// error occurs when you try to insert a record with a value in a field that is required to be unique 
const handleDuplicateFieldsDB = (err) => {
  const regex = /dup key: \{ \w+: "(.*?)" \}/;
  const match = err.errorResponse.errmsg.match(regex)[1];
  const message = `Duplicate field value: ${match}. Please use another value!`;
  return new AppError(message, 400);
};


// error happens when the value passed to a query is of an incorrect type or format. For example, trying to find a document by an invalid ObjectId.
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};


//  error occurs when the data provided does not meet the validation criteria set in the schema.
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};


// error occurs when a JWT (JSON Web Token) is invalid, such as when it is tampered with or malformed.
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);


//  error occurs when a JWT has expired, meaning the token was valid but is now past its expiration time.
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

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

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV?.trim() === 'production') {
    let error = {
      name: err.name,
      message: err.message,
      stack: err.stack,
      ...err
    };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
