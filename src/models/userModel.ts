import { Document, Schema, model, Model, InferSchemaType } from "mongoose"
import bcrypt from "bcryptjs"

interface UserDocument extends Document {
    username: string
    email: string
    password: string
    verified?: boolean

    matchPassword: (enteredPassword: string) => Promise<boolean>
}

const userSchema = new Schema<UserDocument>(
    {
        username: {
            type: String,
            required: true,
            validate: {
                validator: (value: string) => value.length >= 3,
                message: "Username must have at least 3 characters",
            },
        },
        email: {
            type: String,
            required: true,
            validate: {
                validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: "Invalid email format",
            },
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator: (value: string) => value.length >= 8,
                message: "Password must have at least 8 characters",
            },
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

userSchema.pre<UserDocument>("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = model<UserDocument>("User", userSchema)

export default User
