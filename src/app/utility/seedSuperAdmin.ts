/* eslint-disable no-console */
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs"

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
        if (isSuperAdminExists) {
            console.log("Super Admin Already Exists")
            return
        }
        const hashPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))
        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }
        const payload: IUser = {
            name: "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            role: Role.SUPER_ADMIN,
            isVerified: true,
            auth: [
                authProvider
            ]
        }

        const superAdmin = await User.create(payload)
        console.log("superAdmin created");
        console.log(superAdmin);


    } catch (error) {
        console.log(error);

    }
}