import { Router } from "express";
import { UserControllers } from "./user.controller";

export const userRoutes = Router()

userRoutes.post("/register", UserControllers.createUser)

