import express, { Router } from "express";

export default function routes(handler: any): express.Router {
    const router = Router();

    router.get(
        "/",
        handler.getAllLanguages.bind(handler),
    );
    return router;
}
