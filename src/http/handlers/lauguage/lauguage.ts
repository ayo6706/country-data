import { Request, Response, NextFunction, Router } from "express";
import routes from "./routes";
import { Handler } from "../handler";
import { ok } from "../../response/response";
import LanguageService from "../../../services/language";
const basePath = "languages"

export default class LanguageHandler implements Handler {
    private service: LanguageService;

    constructor(
        service: LanguageService,
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
 * /languages:
 *   get:
 *     summary: Retrieve a list of languages and their details
 *     description: Retrieve a list of languages from various countries
 *     responses:
 *       200:
 *         description: languages gotten successfully
 */
    async getAllLanguages(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.getLanguages();
            return ok("languages gotten successfully", result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }
}
