import express from "express";
import cors from "cors";
import config from "config";
import { log } from "./log";
import { Services } from "../services/services";
import errorMiddleware from "./middlewares/error";
import CountryHandler from "./handlers/country/country";
import RegionHandler from "./handlers/region/region";
import LanguageHandler from "./handlers/lauguage/lauguage";
import StatisticsHandler from "./handlers/statistics/statistics";

const apiPath = "/api";
const NODE_ENV = config.get<string>("NODE_ENV");

export default class Http {
    private countryHandler: CountryHandler;

    private regionHandler: RegionHandler;

    private languageHandler: LanguageHandler

    private statisticsHandler: StatisticsHandler

    constructor(services: Services) {
        this.countryHandler = new CountryHandler(services.countryService)
        this.regionHandler = new RegionHandler(services.regionService)
        this.languageHandler = new LanguageHandler(services.languageService)
        this.statisticsHandler = new StatisticsHandler(services.statisticsService)
    }

    basePath(handlerPath: string): string {
        return `${apiPath}/${handlerPath}`;
    }

    serve(port: string) {

        const app = express();
        app.use(cors());
        app.use(express.json({ limit: "50mb" }));
        app.use(express.urlencoded({ limit: "50mb", extended: true }));

        app.get("/", (req, res) => {
            res.send("backend api service");
        });


        app.use(
            this.basePath(
                this.countryHandler.path(),
            ),

            this.countryHandler.routes(),
        );

        app.use(
            this.basePath(
                this.regionHandler.path(),
            ),

            this.regionHandler.routes(),
        );

        app.use(
            this.basePath(
                this.languageHandler.path(),
            ),

            this.languageHandler.routes(),
        );

        app.use(
            this.basePath(
                this.statisticsHandler.path(),
            ),

            this.statisticsHandler.routes(),
        );

        app.use(errorMiddleware);

        if (NODE_ENV !== "test") {
            app.listen(port, () => { log.info("starting express server"); });
        }
        return app;
    }
}
