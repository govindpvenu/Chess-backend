import env from "../utils/validateEnv"
import User from "../models/userModel"
import { Request, Response, NextFunction } from "express"
import passport from "passport"

const GoogleStrategy = require("passport-google-oauth20").Strategy

passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        function (accessToken: any, refreshToken: any, profile: { id: any; displayName: any }, cb: any) {
            console.log(accessToken, profile)
            User.findOne({ googleId: profile.id }, (err: any, user: any) => {
                if (err) return cb(err, null)
                if (!user) {
                    let newUser = new User({
                        googleId: profile.id,
                        username: profile.displayName,
                    })
                    newUser.save()
                    return cb(null, newUser)
                } else {
                    return cb(null, user)
                }
            })
        }
    )
)

// User.findOrCreate({ googleId: profile.id }, function (err, user) {
//   return cb(err, user)
// })

// app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }))

// app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), function (req, res) {
//   // Successful authentication, redirect home.
//   res.redirect("/")
// })
