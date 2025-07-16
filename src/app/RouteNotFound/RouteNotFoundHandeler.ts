import { Request, Response } from "express";


export const RouteNotFoundHandeler = ((req: Request, res: Response) => {
    res.status(401).json({
        success: false,
        message: "Route Not Found"
    })
})

