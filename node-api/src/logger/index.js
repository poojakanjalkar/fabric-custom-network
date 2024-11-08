const productionLogger = require('./productionLogger')

module.exports = function (callingModule) {
  return productionLogger(callingModule);
};