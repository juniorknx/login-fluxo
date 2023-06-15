import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserRouter } from './routes/User.js';
dotenv.config({ path: '../.env' })

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", UserRouter)
app.use(UserRouter)

try {
    mongoose.connect(process.env.MONGO_CREDENTIALS);
    console.log('Mongo connected!');
} catch (error) {
    console.log(error, '<=== FAILED TO CONNECT');
}

app.listen(3001, () => console.log('Server works!!'));
