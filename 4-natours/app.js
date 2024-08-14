const express = require('express');
const morgan = require('morgan'); //Morgan is a popular logging middleware, allows to see requested log data right in the console
const tourRouter = require('./routes/tourRoutes');

//Middleware
const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

// 3) Routes
app.use('/api/v1/tours', tourRouter);

module.exports = app;
