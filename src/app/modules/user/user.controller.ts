/* eslint-disable no-console */
import Router, { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import { sendResponse } from "../../utility/SendResponse";
import { verifyToken } from "../../utility/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
export const userRoutes = Router()


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserServices.createUser(req.body)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Created Successfully",
            data: user,

        })

    }
    catch (error) {
        next(error)
    }
}
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userid = req.params.id
        const token = req.headers.authorization
        const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
        const payload = req.body

        const user = await UserServices.updateUser(userid, payload, verifiedToken)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Updated Successfully",
            data: user,

        })

    }
    catch (error) {
        next(error)
    }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserServices.getAllUsers();
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "All Users Retrieved Successfully",
            data: result.data,
            meta: result.meta
        })
    } catch (error) {
        next(error)

    }
}

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser

}



