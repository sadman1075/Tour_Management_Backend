import { Router } from "express";
import { tourController } from "./tour.controller";
import { checkAuth } from "../../utility/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utility/zodValidate";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation";

export const tourRoutes = Router()

tourRoutes.get("/all-tour", tourController.allTour)
tourRoutes.post("/create",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(createTourZodSchema),tourController.create)
tourRoutes.patch("/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(updateTourZodSchema),tourController.update)
