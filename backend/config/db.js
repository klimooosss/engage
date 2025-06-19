import mongoose from "mongoose"


// connect to db using the mongodb uri, provided by the latter.
export const connectDB = async () => {
    try { // tries to connect, if successful, logs it.
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) { // if unsuccessful, throws an error, stops the process.
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
