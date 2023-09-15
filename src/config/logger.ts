import 'dotenv/config';
import winston, { format } from 'winston';
// import LogdnaWinston from 'logdna-winston';
import appRoot from 'app-root-path';

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf((info) =>
      JSON.stringify({
        timestamp: info?.timestamp,
        level: info?.level,
        message: info?.message,
        splat: info?.splat || '',
      }),
    ),
  ),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
const developement = process.env.NODE_ENV as string;

if (developement === 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

// if (process.env.NODE_ENV === 'production') {
//   logger.add(
//     new LogdnaWinston({
//       key: process.env.LOGDNA_API_KEY,
//       handleExceptions: true,
//       app: 'Mago API',
//       env: process.env.NODE_ENV,
//       index_meta: true,
//     }),
//   );
// }
export const stream = {
  write: (message: any) => {
    logger.info(message);
  },
};


export default logger;