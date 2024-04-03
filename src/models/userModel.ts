import { Document, Schema, model, Model, InferSchemaType } from "mongoose"
import bcrypt from "bcryptjs"

interface UserDocument extends Document {
    _id: string
    googleId?: string
    username: string
    email: string
    password: string
    profile?: string
    verified?: boolean
    wins?: number
    loss?: number
    draw?: number
    rating?: number

    matchPassword: (enteredPassword: string) => Promise<boolean>
}

const userSchema = new Schema<UserDocument>(
    {
        googleId: {
            type: String,
        },
        username: {
            type: String,
            required: true,
            minlength: [3, "Username must be 3 characters"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: "Invalid email format",
            },
        },
        password: {
            type: String,
            // required: true,
            validate: {
                validator: (value: string) => value.length >= 8,
                message: "Password must have at least 8 characters",
            },
        },
        profile:{
            type: String,
            default: ""
        },
        verified: {
            type: Boolean,
            default: false,
        },
        wins: {
            type: Number,
            default: 0,
        },
        draw: {
            type: Number,
            default: 0,
        },
        loss: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
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
