/* eslint-disable import/no-mutable-exports */
import winston, { format } from "winston";
import config from "config";

const {
    combine, timestamp, label, json,
} = format;
const container = new winston.Container();
const ProductionEnvironment = "production";
const DevelopmentEnvironment = "development";

export let log: winston.Logger;

export function useLogger(logger: winston.Logger) {
    log = logger;
}

export function createLogger(loggerID: string): winston.Logger {
    const NodeEnv = config.get<string>("NODE_ENV");
    const transports: any[] = [];

    transports.push(new winston.transports.File({ filename: "app-combined.log" }));
    if (NodeEnv === ProductionEnvironment || DevelopmentEnvironment) {
        transports.push(new winston.transports.Console({
            level: "error",
        }));
    }
    if (NodeEnv === ProductionEnvironment) {
        transports.push(new winston.transports.Console({
            level: "info",
        }));
    } else {
        transports.push(new winston.transports.Console());
    }

    container.add(loggerID, {
        format: combine(
            label({ label: loggerID }),
            timestamp(),
            json(),
        ),
        transports,
    });

    return container.get(loggerID);
}
