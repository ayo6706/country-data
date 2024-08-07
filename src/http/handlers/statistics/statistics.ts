import {
    Request, Response, NextFunction, Router,
} from "express";
import routes from "./routes";
import { Handler } from "../handler";
import { ok } from "../../response/response";
import StatisticsService from "../../../services/statistics";

const basePath = "statistics";

export default class StatisticsHandler implements Handler {
    private service: StatisticsService;

    constructor(
        service: StatisticsService,
    ) {
        this.service = service;
    }

    path(): string {
        return basePath;
    }

    routes(): Router {
        return routes(this);
    }

/**
 * @swagger
 * /statistics:
 *   get:
 *     summary: Retrieve statistics
 *     description: Retrieve statistics
 *     responses:
 *       200:
 *         description: statistics gotten successfully
 */
    async getStatistics(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.getStatistics();
            return ok("statistics gotten successfully", result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }
}
