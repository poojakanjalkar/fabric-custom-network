const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');

// Create a custom token to capture the client's IP address
morgan.token('client-ip', (req) => req.ip || req.connection.remoteAddress);

// Custom message token for error messages
morgan.token('message', (req, res) => res.locals.errorMessage || '');

// Adjust IP format based on environment (for production use real IP)
// const getIpFormat = () =>  (':client-ip - ' : '');

// Define success and error response formats including IP address
const successResponseFormat = ':client-ip - :method :url :status - :response-time ms';
const errorResponseFormat = ':client-ip - :method :url :status - :response-time ms - message: :message';

// Morgan handler for successful responses
const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

// Morgan handler for error responses
const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

// Export handlers
module.exports = {
  successHandler,
  errorHandler,
};
