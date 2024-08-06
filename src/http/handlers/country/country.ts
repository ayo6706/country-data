import { Request, Response, NextFunction, Router } from "express";
import routes from "./routes";
import { Handler } from "../handler";
import CountryService from "../../../services/country";
import { query, param, validationResult } from 'express-validator';
import { ok } from "../../response/response";
const basePath = "countries"

export default class CountryHandler implements Handler {
    private service: CountryService;

    constructor(
        service: CountryService,
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
 * /countries:
 *   get:
 *     summary: Retrieve a list of countries
 *     description: Retrieve a list of countries with optional filtering by region or population size
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter countries by region
 *       - in: query
 *         name: minPopulation
 *         schema:
 *           type: integer
 *         description: Minimum population size
 *       - in: query
 *         name: maxPopulation
 *         schema:
 *           type: integer
 *         description: Maximum population size
 *     responses:
 *       200:
 *         description: A list of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 countries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Country'
 */
    async getCountries(req: Request, res: Response, next: NextFunction) {
        const validations = [
            query('region').optional().isString().trim().escape(),
            query('minPopulation').optional().isInt({ min: 0 }).toInt(),
            query('maxPopulation').optional().isInt({ min: 0 }).toInt(),
            query('page').optional().isInt({ min: 1 }).toInt(),
            query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
        ];

        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({ errors: errors.array() });
        }

        try {
            const { region, minPopulation, maxPopulation, page, limit } = req.query;
            const result = await this.service.getCountries(
                region as string | undefined,
                Number(minPopulation),
                Number(maxPopulation),
                Number(page),
                Number(limit)
            );

            return ok("countries gotten successfully", result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }

/**
 * @swagger
 * /countries/{id}:
 *   get:
 *     summary: Retrieve a specific country
 *     description: Retrieve detailed information for a specific country
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The country ID
 *     responses:
 *       200:
 *         description: Detailed information about a country
 */
    async getCountryById(req: Request, res: Response, next: NextFunction) {
        const validations = [param('id').isMongoId()];

        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({ errors: errors.array() });
            // return res.status(400).json({ errors: errors.array() });
        }

        try {
            const country = await this.service.getCountryCountryDetails(req.params.id);
            if (!country) {
                return next("errors.NoCountryFound")
                // return res.status(404).json({ message: 'Country not found' });
            }
            return ok("gotten country", country).send(res);
        } catch (error: any) {
            return next(error);
        }
    }
}
