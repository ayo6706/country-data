import config from "config";
import Http from "./http/http";
import { Services } from "./services/services";

import RepositoryLogger from "./repository/log";
import HttpLogger from "./http/log";
import { createLogger, useLogger } from "./log";
import ServicesLogger from "./services/log";

const RepositoryLoggerID = "DB";
const ServiceLoggerID = "SRV";
const HTTPLoggerID = "HTTP";
const SystemLoggerID = "SYS";

const PORT = config.get<string>("PORT");
const API_VERSION = config.get<string>("API_VERSION");

function initLoggers() {
    useLogger(createLogger(SystemLoggerID));
    RepositoryLogger.useLogger(createLogger(RepositoryLoggerID));
    ServicesLogger.useLogger(createLogger(ServiceLoggerID));
    HttpLogger.useLogger(createLogger(HTTPLoggerID));
}

function main(): void {
    initLoggers();

    const services: Services = {

    };

    const http = new Http(services);
    http.serve(process.env.PORT || PORT, API_VERSION);
}

main();
