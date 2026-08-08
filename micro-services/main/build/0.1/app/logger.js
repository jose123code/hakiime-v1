
const path = require('path');
const { createLogger, transports, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');


// Create logs directory if not exists
const logsDirectory = path.join(__dirname, '../../logs');
if (!require('fs').existsSync(logsDirectory)) {
  require('fs').mkdirSync(logsDirectory);
}


// Setup Winston Logger
const logger = createLogger({
    transports: [
      new transports.Console(),
      new DailyRotateFile({
        filename: path.join(logsDirectory, 'app-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: format.combine(
          format.timestamp(),
          format.json()
        ),
      }),
    ],
  });


function createChildLogger(logger, className) {
  return logger.child({ child: "rabbitmq-pub-sub", "class": className }, true);
}

module.exports = {
  createChildLogger,
  Logger: logger
};

