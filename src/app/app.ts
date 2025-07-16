import express, { Application,  Request, Response } from "express"
import cors from "cors"
import { globalErrorHandaler } from "./golobalErrorHandelar/golobalErrorHandelar"
import { RouteNotFoundHandeler } from "./RouteNotFound/RouteNotFoundHandeler"
import { credentialLogin } from "./auth/auth.controller"
import { userRoutes } from "./modules/user/user.routes"
const app: Application = express()


app.use(express.json())
app.use(cors())

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/auth",credentialLogin)


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "welcome to tour management system"
    })
})

app.use(globalErrorHandaler)
app.use(RouteNotFoundHandeler)



export default app;