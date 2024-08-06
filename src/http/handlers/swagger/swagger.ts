import express from "express";
import { Handler } from "../handler";
import routes from "./routes";

export default class SwaggerHandler implements Handler {
    routes(): express.Router {
        return routes();
    }

    path(): string {
        return "";
    }
}
