import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import dealRoutes from './routes/deal.route.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json()); //allows us to accept JSON data in the body | MIDDLE-WARE

//route system
app.use("/api/auth", authRoutes)
app.use("/api/deal", dealRoutes)

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at port 5000....")
})