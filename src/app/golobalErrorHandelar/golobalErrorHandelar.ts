import { NextFunction, Request, Response } from "express";

export const globalErrorHandaler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        message: `something went wrong ${err.message}`
    })
}


