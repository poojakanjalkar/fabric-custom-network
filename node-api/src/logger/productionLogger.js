const { createLogger, format, transports } = require('winston');

const { combine, timestamp, label, printf } = format;
const path = require('path');

const config = require('../config/config');
require('winston-daily-rotate-file');

const getLabel = function (callingModule) {
  const parts = callingModule.filename.split('/');
  return `${parts[parts.length - 2]}/${parts.pop()}`;
};

const productionLogger = (name) => {
  // let filePath = `${CWD}../jobs/NetworksData/logger`;
  let filePath = path.join(process.cwd(),  'src','jobs', 'NetworksData','loggerData', 'file-');

  return createLogger({
    level: 'debug',
    format: combine(
      label({
        label: name,
      }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.json() 
    ),

    transports: [
      new transports.Console(),
      new transports.DailyRotateFile({
        filename: `${filePath}all-%DATE%.log`,
        label: getLabel(module),
        handleExceptions: true,
        humanReadableUnhandledException: true,
        level: 'info',
        timestamp: true,
        json: true,
      }),
      new transports.DailyRotateFile({
        filename: `${filePath}errors-%DATE%.log`,
        level: 'error',
        prettyPrint: true,
        colorize: true,
        timestamp: true,
      }),
    ],
  });
};

module.exports = function (module) {
  return {
    error(text) {
      productionLogger(getLabel(module)).error(text);
    },
    info(text) {
      productionLogger(getLabel(module)).info(text);
    },
  };
};
