import { Request, Response, NextFunction, Router } from "express";
import routes from "./routes";
import { Handler } from "../handler";
import { ok } from "../../response/response";
import RegionService from "../../../services/region";
const basePath = "regions"

export default class RegionHandler implements Handler {
    private service: RegionService;

    constructor(
        service: RegionService,
    ) {
        this.service = service;
    }

    path(): string {
        return basePath;
    }

    routes(): Router {
        return routes(this);
    }

    async getAllRegions(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.getAllRegions();
            return ok("regions gotten successfully", result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }
}
