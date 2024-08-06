import express from "express";

export interface Handler {
    // path returns the basePath of the route. All endpoints in this handler
    // will be served as a sub-path of this path
    path(): string
    // routes returns the express router object of the handler.
    routes(): express.Router
}
