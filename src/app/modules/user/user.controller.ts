/* eslint-disable no-console */
import Router, { NextFunction, Request, Response } from "express"
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import { createUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
export const userRoutes = Router()


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await UserServices.createUser(req.body)


        res.status(httpStatus.CREATED).json({
            message: "User created successfully",
            user: user
        })

    }
    catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).json({
            message: "something went wrong", error
        })
    }


}

export const UserControllers = {
    createUser
}

// userRoutes.post("/register", async (req: Request, res: Response) => {

//     try {

//         const body = await createUserZodSchema.parseAsync(req.body);
//         const { name, email, password } = body
//         const isUserExist = await User.findOne({ email })
//         if (isUserExist) {
//             console.log("User already exists");
//         }

//         const hashePassword = await bcryptjs.hash(password as string, 10)

//         const userInfo = { name, email, password: hashePassword }
//         const user = await User.create(userInfo)

//         res.status(200).json({
//             message: `successfully created user `, user: user
//         })
//     }
//     catch (error) {
//         res.status(401).json({
//             message: "something went wrong", error
//         })
//     }
// });

userRoutes.get("/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        const verifiedToken = jwt.verify(accessToken as string, "secret")
        console.log(verifiedToken);
        if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {
            throw new error("you are not permited to view this section")
        }
        console.log(verifiedToken);
        const allUser = await User.find({})
        res.status(200).json({
            message: `successfully created user `, user: allUser
        })
    }
    catch (error) {
        next(error)
    }
});
userRoutes.get("/register/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const allUser = await User.findById(id)
        res.status(200).json({
            message: `successfully created user `, user: allUser
        })
    }
    catch (error) {
        next(error)
    }
})

userRoutes.put("/update-user/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { password } = body
        const hashePassword = bcryptjs.hash(password)
        const allUser = await User.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: `successfully created user `, user: allUser
        })
    }
    catch (error) {
        res.status(401).json({
            message: "something went wrong", error
        })
    }
});

