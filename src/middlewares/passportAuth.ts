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

// import jwt from "jsonwebtoken"
// import asyncHandler from "express-async-handler"
// import User from "../models/userModel"
// import env from "../utils/validateEnv"
// import { Request, Response, NextFunction } from "express"

// interface RequestWithUser extends Request {
//   user?: any // Update this to match your User model or use UserDocument if possible
// }

// const protect = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
//   let token = req.cookies.user
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, env.JWT_SECRET)
//       req.user = await User.findById(decoded.sub).select("-password")
//       next()
//     } catch (error) {
//       res.status(401)
//       throw new Error("Not authorized, invalid token")
//     }
//   } else {
//     res.status(401)
//     throw new Error("Not authorized, no token")
//   }
// })

// export { protect }
