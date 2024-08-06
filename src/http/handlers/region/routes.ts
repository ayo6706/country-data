import express, { Router } from "express";

export default function routes(handler: any): express.Router {
    const router = Router();

    router.get(
        "/",
        handler.getAllRegions.bind(handler),
    );
    return router;
}
