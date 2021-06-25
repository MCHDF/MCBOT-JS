const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const logDir = `./messageDeleteLog`;

const {
    combine,
    timestamp,
    printf
} = winston.format;

const logFormat = printf(({
    level,
    message,
    timestamp
}) => {
    return `[${timestamp}] [ ${level} ]: ${message}`;
})

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
    ),
    transports: [
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYYMMDD',
            dirname: logDir,
            filename: `MCBOT_delete_%DATE%.log`,
            maxFiles: 30,
            zippedArchive: false
        })
    ]
})

module.exports = logger;