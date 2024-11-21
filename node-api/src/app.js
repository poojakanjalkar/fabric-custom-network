const express = require('express');
const helmet = require('helmet');
const os = require('os');
const process = require('process');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter, requestLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const logger = require('./logger')(module)
const { requestInfo } = require('./middlewares/requestInfo');
const { getAllMemoryInfo } = require('./utils/utils');


const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(requestInfo);


logger.info({ message: 'This is test message' })

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
  });

logger.error("This is test message")
// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());


// limit repeated failed requests to auth endpoints
app.use('/v1/auth', authLimiter);

// v1 api routes
app.use('/v1', requestLimiter, routes);
app.get('/health', (req, res) => {
  const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
  };
  res.status(200).send(healthcheck);
});

app.get('/health-details', (req, res) => {
  const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      memoryInfo: getAllMemoryInfo()
  };
  res.status(200).send(healthcheck);
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
