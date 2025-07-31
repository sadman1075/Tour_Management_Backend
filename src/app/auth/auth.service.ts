/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs"
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error_helpers/AppError";
import httpStatus from "http-status-codes"
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../utility/userToken";




const getNewAccessToken = async (refreshToken: string) => {
    const accessToken = createNewAccessTokenWithRefreshToken(refreshToken)

    return {

        accessToken: accessToken,
    }
}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user?.password as string)

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "old password does not match")
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    user!.save()
}

export const authservice = {
    getNewAccessToken,
    resetPassword
}