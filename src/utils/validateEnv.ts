import { cleanEnv, port, str } from "envalid"

export default cleanEnv(process.env, {
    PORT: port(),
    CLIENT_URL: str(),
    SERVER_URL: str(),
    MONGO_URL: str(),
    JWT_SECRET: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
})
