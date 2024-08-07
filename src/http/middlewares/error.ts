import { Request, Response, NextFunction } from "express";
import { ServiceError } from "../../errors/services";
import HttpError from "../../errors/http";
import DatabaseError from "../../errors/database";
import { ERROR_RESPONSE, fail } from "../response/response";
import { log } from "../../log";

function errorToStatusCode(err: Error): number {
    switch (err.constructor.name) {
    case ServiceError.name:
    default:
        return ERROR_RESPONSE.SERVER_ERROR;
    }
}

export default function errorMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    let status: number = 500;
    let message = error.message || "Something went wrong";
    let errorCode:string | undefined;
    switch (error.constructor.name) {
    case ServiceError.name:
        status = errorToStatusCode(error);
        break;
    case HttpError.name:
        if (error instanceof HttpError && typeof error.statusCode === "number") {
            status = error.statusCode;
        }
        break;
    case DatabaseError.name:
        status = errorToStatusCode(error);
        message = "Something went wrong";
        break;
    default:
        status = 500;
        log.error(error);
        message = "Something went wrong";
    }
    fail(message, status, errorCode).send(res);
}
