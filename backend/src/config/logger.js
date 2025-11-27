import winston from "winston";
import env from "./env.js";

// Typically only logs in production but also turned on for development here for easier testing

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  return env.NODE_ENV === "development" ? "debug" : "warn";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Base format for all transports
const baseFormat = [
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  ),
];

const transports = [
  // Console transport with colorization
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      ...baseFormat
    ),
  }),
  // File transport for errors (without colorization)
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format: winston.format.combine(...baseFormat),
  }),
  // File transport for all logs (without colorization)
  new winston.transports.File({
    filename: "logs/all.log",
    format: winston.format.combine(...baseFormat),
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

export default logger;
