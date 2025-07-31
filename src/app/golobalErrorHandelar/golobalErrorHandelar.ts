import { NextFunction, Request, Response } from "express";
import { success } from "zod";
import { envVars } from "../config/env";
import AppError from "../../error_helpers/AppError";

export const globalErrorHandaler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = `something went wrong ${err.message}`
    if (err.code === 11000) {
        console.log("Dublicate error ");
        message =` ${err.message}`
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}


