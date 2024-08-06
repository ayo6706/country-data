import express, { Router } from "express";

export default function routes(handler: any): express.Router {
    const router = Router();

    router.get(
        "/",
        handler.getCountries.bind(handler),
    );
    router.get(
        "/:id",
        handler.getCountryById.bind(handler),
    );
    return router;
}
