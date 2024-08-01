/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import config from "config";

import { log } from "./log";

import { Services } from "../services/services";

const apiPath = "/api";
const NODE_ENV = config.get<string>("NODE_ENV");

export default class Http {

    private apiVersion: string = "";

    constructor(services: Services) {

    }

    basePath(handlerPath: string): string {
        return `${apiPath}/${this.apiVersion}${handlerPath}`;
    }

    serve(port: string, version: string) {
        this.apiVersion = version;

        const app = express();
        app.use(cors());
        app.use(express.json({ limit: "50mb" }));
        app.use(express.urlencoded({ limit: "50mb", extended: true }));


        app.get("/", (req, res) => {
            res.send("backend api service");
        });

        if (NODE_ENV !== "test") {
            app.listen(port, () => { log.info("starting express server"); });
        }
        return app;
    }
}
