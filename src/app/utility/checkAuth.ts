import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error_helpers/AppError";
import { envVars } from "../config/env";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyToken } from "./jwt";
import httpStatus from "http-status-codes"
import { NextFunction, Request, Response } from "express";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403, "No Token Received")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload


        const isUserExist = await User.findOne({ email: verifiedToken.email })
        
        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
        }
        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }
        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "Your are not allowed to view this route")
        }
        req.user = verifiedToken
        next()

    } catch (error) {
        next(error)
    }
}
