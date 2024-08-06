import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Countries API",
            version: "1.0.0",
        },
        servers: [{ url: "/api" }],
    },
    apis: [
        "./src/dto/**/*.ts", "./src/http/handlers/**/*.ts",
    ],
};

export default function routes(): express.Router {
    const router = express.Router();
    router.use("/api-docs", swaggerUi.serve);
    router.get("/api-docs", swaggerUi.setup(swaggerJsdoc(options)));
    return router;
}
