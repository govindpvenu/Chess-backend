import express from "express"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import session from "express-session"

import "dotenv/config"
import env from "./utils/validateEnv"
import connectDB from "./config/db"
import passport from "passport"
import userRoutes from "./routes/userRoutes"
import { notFound, errorHandler } from "./middlewares/errorHandler"
require("./config/googleAuth")

connectDB()
const app = express()
app.use(morgan("dev"))
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
)
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use("/api/user", userRoutes)
app.get("/", (req, res) => res.send("Server is ready"))

app.use(notFound)
app.use(errorHandler)

const port = env.PORT || 5000
app.listen(port, () => console.log(`Server started on port ${port}`))
