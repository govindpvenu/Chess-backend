import express from "express"
import "dotenv/config"
import env from "./utils/validateEnv"
import connectDB from "./config/db"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport"
import userRoutes from "./routes/userRoutes"
import { notFound, errorHandler } from "./middlewares/errorHandler"

connectDB()

const app = express()
app.use(morgan("dev"))
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())

app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }))
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login", successRedirect: "/" }))

app.use("/api/users", userRoutes)
app.get("/", (req, res) => res.send("Server is ready"))

app.use(notFound)
app.use(errorHandler)

const port = env.PORT || 5000
app.listen(port, () => console.log(`Server started on port ${port}`))
