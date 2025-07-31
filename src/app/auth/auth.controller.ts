/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";


// import jwt from "jsonwebtoken"
import httpStatus from "http-status-codes"
import { authservice } from "./auth.service";
import { sendResponse } from "../utility/SendResponse";
import AppError from "../../error_helpers/AppError";
import { createUserTokens } from "../utility/userToken";
import { envVars } from "../config/env";
import passport from "passport";
import { setAuthCookie } from "../utility/setCookie";



const credentialLogin =async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", async (err: any, user: any, info: any) => {
console.log(user);
        if (err) {
            return next(new AppError(401, err))
        }

        if (!user) {
      
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserTokens(user)

        const { password: pass, ...rest } = user.toObject()


        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest

            },
        })
    })(req, res, next)




}







const getNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        console.log("controller:", refreshToken);

        if (!refreshToken) {
            throw new AppError(403, "no refresh token is received from cookies")
        }
        const tokenInfo = await authservice.getNewAccessToken(refreshToken)

        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: false
        })


        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Log in Successfully",
            data: tokenInfo,

        })
    }
    catch (error) {
        next(error)
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Log out Successfully",
            data: null,

        })
    } catch (error) {
        next(error)
    }
}
const resetPassword = async (req: Request, res: Response) => {

    const decodedToken = req.user
    if (!decodedToken) {
        throw new AppError(503, "decoded token not found")
    }
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword
    await authservice.resetPassword(oldPassword, newPassword, decodedToken)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User password reset Successfully",
        data: null,
    })
}

const googleCallBack = async (req: Request, res: Response) => {

    let redirectTo = req.query.state ? req.query.state as string : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user;
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    const tokenInfo = createUserTokens(user)


    setAuthCookie(res, tokenInfo)


    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
}




export const authController = {
   credentialLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallBack
}



// credentialLogin.post("/login", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const body = req.body;
//         const { email, password } = body
//         const isUserExist = await User.findOne({ email })




//         const jwtPayload = {
//             userId: isUserExist?._id,
//             email: isUserExist?.email,
//             role: isUserExist?.role
//         }

//         const accessToken = jwt.sign(jwtPayload, "secret", {
//             expiresIn: "1d"
//         })

//         // return accessToken;

//         res.status(200).json({
//             message: "login successfully",
//             data: accessToken
//         })


//     }
//     catch (error) {
//         next(error)
//     }
// })

// credentialLogin.get("/", async (req: Request, res: Response) => {
//     res.send("login routes")
// })
