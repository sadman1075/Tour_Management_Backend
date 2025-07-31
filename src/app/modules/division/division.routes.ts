import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../utility/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utility/zodValidate";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";

export const divisionRoutes=Router()

divisionRoutes.post("/create",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(createDivisionSchema),divisionController.create)
divisionRoutes.get("/",divisionController.allDivision)
divisionRoutes.get("/:slug",divisionController.singleDivision)
divisionRoutes.patch("/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(updateDivisionSchema),divisionController.update)
divisionRoutes.delete("/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),divisionController.deleteDivision)