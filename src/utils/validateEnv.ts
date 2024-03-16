import { cleanEnv, port, str } from "envalid"

export default cleanEnv(process.env, {
    PORT: port(),
    MONGO_URL: str(),
    JWT_SECRET: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
})
