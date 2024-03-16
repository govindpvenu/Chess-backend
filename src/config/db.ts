import mongoose from "mongoose"
import env from "../utils/validateEnv"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGO_URL)
        console.log(`Database Connected:${conn.connection.host}`)
    } catch (error: any) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}
export default connectDB
