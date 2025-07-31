import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error_helpers/AppError";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken
    }

}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = await verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })
    
    if (!isUserExist) {
        throw new AppError(504, "Email dose not Exists")
    }
    if (isUserExist.isActive === IsActive.BLOCKED) {
        throw new AppError(504, "User is inActive")
    }
    if (isUserExist.isDeleted) {
        throw new AppError(504, "User is Deleted")
    }


    const jwtPayload = {
        userId: isUserExist?._id,
        email: isUserExist?.email,
        role: isUserExist?.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return {
        accessToken
    }
}