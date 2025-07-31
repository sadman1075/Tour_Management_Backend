import { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../utility/SendResponse";
import httpStatus from "http-status-codes"
import { tourService } from "./tour.service";


const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tour = await tourService.create(req.body)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Created Successfully",
            data: tour,

        })
    } catch (error) {
        
        next(error)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const tour = await tourService.update(id, req.body)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Created Successfully",
            data: tour,

        })
    } catch (error) {
        next(error)
    }
}
const allTour = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("sadman");
    } catch (error) {
        next(error)
    }
}


export const tourController = {
    allTour,
    create,
    update
}