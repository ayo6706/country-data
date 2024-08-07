import mongoose from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import Setup from "./setup";
import initializeData from "../../jobs/countryupdate";
import Country from "../../repository/country/models";

const setup = new Setup();
const server = setup.init();
const baseRoute = "/api";
const countriesRoute = `${baseRoute}/countries`;
const regionsRoute = `${baseRoute}/regions`;
const languagesRoute = `${baseRoute}/languages`;
const statisticsRoute = `${baseRoute}/statistics`;

describe("Country API Integration Tests", () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        await initializeData();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe("GET /api/countries", () => {
        it("should return all countries with pagination", async () => {
            const { body, statusCode } = await supertest(server)
                .get(countriesRoute)
                .query({ page: 1, limit: 10 });

            expect(statusCode).toBe(200);
            expect(body.success).toBe(true);
            expect(body.data.countries.length).toBeGreaterThan(0);
            expect(body.data.totalPages).toBeGreaterThan(0);
        });

        it("should filter countries by region", async () => {
            const { body, statusCode } = await supertest(server)
                .get(countriesRoute)
                .query({ region: "Europe" });
            expect(statusCode).toBe(200);
            expect(body.success).toBe(true);
            expect(body.data.countries.length).toBeGreaterThan(0);
            expect(body.data.countries.every((country: Country) => country.region === "Europe")).toBe(true);
        });
    });

    describe("GET /api/countries/:id", () => {
        it("should return 400 for non-existent country", async () => {
            const { statusCode } = await supertest(server)
                .get(`${countriesRoute}/nonexistentid`);
            expect(statusCode).toBe(400);
        });
    });

    describe("GET /api/regions", () => {
        it("should return all regions with countries", async () => {
            const { body, statusCode } = await supertest(server)
                .get(regionsRoute);

            expect(statusCode).toBe(200);
            expect(body.success).toBe(true);
            expect(body.data.length).toBeGreaterThan(0);
            expect(body.data[0]).toHaveProperty("region");
        });
    });

    describe("GET /api/languages", () => {
        it("should return all languages with countries", async () => {
            const { body, statusCode } = await supertest(server)
                .get(languagesRoute);

            expect(statusCode).toBe(200);
            expect(body.success).toBe(true);
            expect(body.data.length).toBeGreaterThan(0);
            expect(body.data[0]).toHaveProperty("language");
        });
    });

    describe("GET /api/statistics", () => {
        it("should return aggregated statistics", async () => {
            const { body, statusCode } = await supertest(server)
                .get(statisticsRoute);

            expect(statusCode).toBe(200);
            expect(body.success).toBe(true);
            expect(body.data).toHaveProperty("totalCountries");
            expect(body.data).toHaveProperty("largestCountry");
            expect(body.data).toHaveProperty("smallestCountry");
            expect(body.data).toHaveProperty("mostSpokenLanguage");
        });
    });
});
