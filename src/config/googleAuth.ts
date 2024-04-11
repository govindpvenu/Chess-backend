import env from "../utils/validateEnv"
import User from "../models/userModel"
import passport from "passport"

const GoogleStrategy = require("passport-google-oauth20").Strategy

passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/auth/auth/google/callback",
        },
        function (accessToken: string, refreshToken: string, profile: { displayName: string; emails: { value: string }[]; photos: { value: string }[] }, cb: (err: Error | null, user?: any) => void) {
            User.findOne({ email: profile.emails[0].value })
                .then((user) => {
                    console.log(user)
                    console.log(profile.photos[0]?.value)
                    if (!user) {
                        console.log({ profile })
                        let newUser = new User({
                            username: profile.displayName,
                            email: profile.emails[0].value,
                            profile: profile.photos[0]?.value,
                            verified: true,
                        })
                        return newUser.save().then(() => newUser)
                    } else {
                        return user
                    }
                })
                .then((user) => cb(null, user))
                .catch((err) => cb(err, null))
        }
    )
)

//Persists user data inside session
passport.serializeUser(function (user: any, done) {
    done(null, user.id)
})

//Fetches session details using session id
passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then((user) => {
            done(null, user)
        })
        .catch((err) => {
            done(err, null)
        })
})

// User.findOrCreate({ googleId: profile.id }, function (err, user) {
//   return cb(err, user)
// })

// app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }))

// app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), function (req, res) {
//   // Successful authentication, redirect home.
//   res.redirect("/")
// })
// User.findOne({ googleId: profile.id }, (err: any, user: any) => {
//     if (err) return cb(err, null)
//     if (!user) {
//         let newUser = new User({
//             googleId: profile.id,
//             username: profile.displayName,
//         })
//         newUser.save()
//         return cb(null, newUser)
//     } else {
//         return cb(null, user)
//     }
// })
