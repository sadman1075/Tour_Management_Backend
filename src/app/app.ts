import express, { Application, Request, Response } from "express"
import cors from "cors"
import { globalErrorHandaler } from "./golobalErrorHandelar/golobalErrorHandelar"
import { RouteNotFoundHandeler } from "./RouteNotFound/RouteNotFoundHandeler"
import { userRoutes } from "./modules/user/user.routes"
import { authRoutes } from "./auth/auth.route"
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"
import "./config/passport"
import { tourRoutes } from "./modules/tour/tour.routes"
import { divisionRoutes } from "./modules/division/division.routes"

const app: Application = express()
app.use(expressSession({
    secret: "your secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/tour", tourRoutes)
app.use("/api/v1/division", divisionRoutes)


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "welcome to tour management system"
    })
})

app.use(globalErrorHandaler)
app.use(RouteNotFoundHandeler)



export default app;