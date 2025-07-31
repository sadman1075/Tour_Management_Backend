/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import bcryptjs from "bcryptjs"
passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(null, false, { message: "no email found" })
                }

                let user = await User.findOne({ email })
                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auth: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                }
                return done(null, user)
            } catch (error) {
                console.log("google stategy error", error);
                return done(error)
            }
        }

    )
)



passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({ email })
            if (!isUserExist) {
                return done("User Does not exists")
            }
            if (!isUserExist.isVerified) {
                return done("User is not verified")
            }

            if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
                // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
                return done(`User is ${isUserExist.isActive}`)
            }
            if (isUserExist.isDeleted) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
                return done("User is deleted")
            }

            const isGoogleAuthenticated = isUserExist.auth.some(providerObjects => providerObjects.provider == "google")

            if (isGoogleAuthenticated && !isUserExist.password) {
                return done("You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.")
            }

            const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

            if (!isPasswordMatched) {
                return done(null, false, { message: "Password is not matched" })
            }

            return done(null, isUserExist)

        } catch (error) {
          
            done(error)
        }

    })
)





passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)

})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})