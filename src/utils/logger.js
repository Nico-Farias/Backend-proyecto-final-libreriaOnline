import {createLogger, format, transports} from 'winston'
const {combine, printf, timestamp, colorize} = format;

const configLogguer = {
    level: 'silly',
    format: combine(timestamp({format: 'MM-DD-YYYY HH:mm:ss'}), colorize(),
    // prettyPrint(),
        printf((info) => `${
        info.level
    } | ${
        info.timestamp
    } | ${
        info.message
    }`)),


    transports: [

        new transports.File(
            {filename: './loguers.log', level: 'info'}
        ),
        new transports.Console(
            {level: 'debug'}
        )
    ]
}

export const logguer = createLogger(configLogguer)
