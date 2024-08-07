import config from "config";
import cron from "node-cron";
import mongoose from "mongoose";
import Http from "./http/http";
import { Services } from "./services/services";
import RepositoryLogger, { log } from "./repository/log";
import HttpLogger from "./http/log";
import { createLogger, useLogger } from "./log";
import ServicesLogger from "./services/log";
import CountryService from "./services/country";
import CountryRepositoryMongo from "./repository/country/country.mongo";
import RegionService from "./services/region";
import LanguageService from "./services/language";
import StatisticsService from "./services/statistics";
import { CountryUpdateToDB } from "./jobs/countryupdate";

const RepositoryLoggerID = "DB";
const ServiceLoggerID = "SRV";
const HTTPLoggerID = "HTTP";
const SystemLoggerID = "SYS";

const DBUri = config.get<string>("DBUri");

export function initLoggers() {
    useLogger(createLogger(SystemLoggerID));
    RepositoryLogger.useLogger(createLogger(RepositoryLoggerID));
    ServicesLogger.useLogger(createLogger(ServiceLoggerID));
    HttpLogger.useLogger(createLogger(HTTPLoggerID));
}

export async function closeMongooseConnection(): Promise<void> {
    await mongoose.connection.close().then(() => {
        log.info("Mongoose connection closed successfully");
    });
}

export async function connectToDatabase(): Promise<void> {
    await mongoose.connect(DBUri);
    log.info(`connected to db successfully on ${DBUri}`);
}

export function setupGracefulShutdown() {
    process.on("SIGINT", async () => {
        await closeMongooseConnection();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        await closeMongooseConnection();
        process.exit(0);
    });
}

export function createServices(): Services {
    return {
        countryService: new CountryService(new CountryRepositoryMongo()),
        regionService: new RegionService(new CountryRepositoryMongo()),
        languageService: new LanguageService(new CountryRepositoryMongo()),
        statisticsService: new StatisticsService(new CountryRepositoryMongo()),
    };
}

export function createApp(): Http {
    // Schedule task to run at midnight every day
    cron.schedule("0 0 * * *", async () => {
        await CountryUpdateToDB();
        log.info("scheduled database update executed");
    });
    const services = createServices();
    return new Http(services);
}
