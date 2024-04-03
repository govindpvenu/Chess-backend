import jwt from "jsonwebtoken"
import env from "./validateEnv"
import { Request, Response } from "express"

const generateToken = (res: Response, userId: string, role: string):string => {
    const payload = {
        sub: userId,
        role: role,
        iat: Math.floor(Date.now() / 1000),
    }
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "30d" })

    res.cookie(role, token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    return token
}

export default generateToken
