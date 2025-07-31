/* eslint-disable no-console */
import { Server } from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./utility/seedSuperAdmin";


let server: Server;


async function main() {
    try {
        await mongoose.connect(envVars.DB_URL);
        server = app.listen(envVars.PORT, () => {
            console.log(`the server is listening  port ${envVars.PORT}`);
        })
    }
    catch (error) {
        console.log(error);
    }

}

(async () => {
   await main()
   await seedSuperAdmin()
})()




process.on("unhandledRejection", (err) => {
    console.log("unhandledRejection detected....server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        });

    }
    process.exit(1)
})
process.on("uncaughtException", (err) => {
    console.log("uncaughtException detected....server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        });

    }
    process.exit(1)
})
process.on("SIGTERM", () => {
    console.log("Sigterm signal received....server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1)
        });

    }
    process.exit(1)
})