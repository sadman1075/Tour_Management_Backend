/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../../error_helpers/AppError";
import { envVars } from "../../config/env";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes"


const createUser = async (payload: Partial<IUser>) => {
    const { name, email, password } = payload;
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email! }
    const hashPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    const user = await User.create({
        name,
        email,
        auth: [authProvider],
        password: hashPassword
    })

    

    return user
}

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    if (payload.role) {
        const isUserExists = await User.findById(userId)
        if (!isUserExists) {
            throw new AppError(httpStatus.FORBIDDEN, "your are not authorized")

        }

        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "your are not authorized")
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "your are not authorized")
        }

        if (payload.isActive || payload.isDeleted || payload.isVerified) {
            throw new AppError(httpStatus.FORBIDDEN, "your are not authorized")

        }
        if (payload.password) {
            payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
        }

        const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

        return newUpdateUser
    }
}





export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
}