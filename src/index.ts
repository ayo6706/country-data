import config from "config";
import Http from "./http/http";
import { Services } from "./services/services";
import RepositoryLogger, { log } from "./repository/log";
import HttpLogger from "./http/log";
import { createLogger, useLogger } from "./log";
import ServicesLogger from "./services/log";
import CountryService from "./services/country";
import CountryRepositoryMongo from "./repository/country/country.mongo";
import mongoose from "mongoose";
import RegionService from "./services/region";
import LanguageService from "./services/language";
import StatisticsService from "./services/statistics";

const RepositoryLoggerID = "DB";
const ServiceLoggerID = "SRV";
const HTTPLoggerID = "HTTP";
const SystemLoggerID = "SYS";

const PORT = config.get<string>("PORT");
const DBUri = config.get<string>("DBUri");

function initLoggers() {
    useLogger(createLogger(SystemLoggerID));
    RepositoryLogger.useLogger(createLogger(RepositoryLoggerID));
    ServicesLogger.useLogger(createLogger(ServiceLoggerID));
    HttpLogger.useLogger(createLogger(HTTPLoggerID));
}


async function  closeMongooseConnection(): Promise<void> {
    await mongoose.connection.close().then((() => {
        log.info("Mongoose connection closed successfully")
    }));
}

function main(): void {
    initLoggers();

    mongoose.connect(DBUri)
    .then(() => { log.info(`connected to db successfully on ${DBUri}`); })
    .catch((err) => log.error(`db connection error: ${err}`));

    process.on("SIGINT", async () => {
        await closeMongooseConnection();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        await closeMongooseConnection();
        process.exit(0);
    });

    const services: Services = {
        countryService: new CountryService(new CountryRepositoryMongo()),
        regionService: new RegionService(new CountryRepositoryMongo()),
        languageService: new LanguageService(new CountryRepositoryMongo()),
        statisticsService: new StatisticsService(new CountryRepositoryMongo())
    };

    const http = new Http(services);
    http.serve(process.env.PORT || PORT);
}

main();
