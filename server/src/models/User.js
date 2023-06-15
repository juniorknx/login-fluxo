import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    city: { type: String, required: true },
    age: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

export const UserModel = mongoose.model('users', UserSchema);