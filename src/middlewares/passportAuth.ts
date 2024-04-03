import env from "../utils/validateEnv"
import User from "../models/userModel"
import { Request, Response, NextFunction } from "express"
import passport from "passport"
const JwtStrategy = require("passport-jwt").Strategy

var cookieExtractor = function (req: Request) {
    var token = null
    if (req && req.cookies) {
        token = req.cookies.user
    }
    return token
}

var opts: any = {}
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey = env.JWT_SECRET

passport.use(
    new JwtStrategy(opts, async function (jwt_payload: any, done: any) {
        console.log(jwt_payload)
        User.findOne({ _id: jwt_payload.sub })
            .then((user: any) => {
                if (user) {
                    // req.user = user
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            })
            .catch((err: any) => {
                return done(err, false)
            })
    })
)

export const protect = passport.authenticate("jwt", { session: false })
