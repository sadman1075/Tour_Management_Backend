/* eslint-disable no-console */
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../utility/checkAuth";
import { Router } from "express";
import { validateRequest } from "../../utility/zodValidate";
import { Role } from "./user.interface";






export const userRoutes = Router()

userRoutes.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)
userRoutes.get("/all-user", checkAuth("ADMIN", "SUPER_ADMIN"), UserControllers.getAllUsers)
userRoutes.patch("/:id", checkAuth(...Object.values(Role)), UserControllers.updateUser)


