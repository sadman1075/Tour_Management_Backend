/* eslint-disable no-console */
import { NextFunction, Request, Response, Router } from "express";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
export const credentialLogin = Router()

credentialLogin.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const { email, password } = body
        const isUserExist = await User.findOne({ email })

        if (!isUserExist) {
            console.log("Email does not exists");
        }
        const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password)

        if (!isPasswordMatched) {
            console.log("Password does not match");
        }

        const jwtPayload = {
            userId: isUserExist?._id,
            email: isUserExist?.email,
            role: isUserExist?.role
        }

        const accessToken = jwt.sign(jwtPayload, "secret", {
            expiresIn: "1d"
        })

        // return accessToken;

        res.status(200).json({
            message: "login successfully",
            data: accessToken
        })


    }
    catch (error) {
        next(error)
    }
})

credentialLogin.get("/", async (req: Request, res: Response) => {
    res.send("login routes")
})
