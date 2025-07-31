import { NextFunction, Request, Response } from "express"
import { divisionService } from "./division.service"
import { sendResponse } from "../../utility/SendResponse"
import httpStatus from "http-status-codes"
const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const division = await divisionService.create(req.body)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Created Successfully",
            data: division,

        })
    } catch (error) {
        next(error)
    }
}
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id=req.params.id;
        const division = await divisionService.update(id,req.body)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Created Successfully",
            data: division,

        })
    } catch (error) {
        next(error)
    }
}


const allDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await divisionService.getAllDivision();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Divisions retrieved",
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        next(error)
    }
}
const singleDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await divisionService.getSingleDivision(req.body);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Divisions retrieved",
            data: result,
        });
    } catch (error) {
        next(error)
    }
}

const updateDivision = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await divisionService.updateDivision(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division updated",
        data: result,
    });
};



const deleteDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const result = await divisionService.deleteDivision(req.params.id)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Successfully deleted",
            data: result,

        })
    } catch (error) {
        next(error)
    }
}



export const divisionController = {
    create,
    update,
    allDivision,
    singleDivision,
    updateDivision,
    deleteDivision,

}