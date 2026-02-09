import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import ConnectDb from "./config/database.js"
import { expenseRouter } from "./routes/expenseRoutes.js"
import { authRouter } from "./routes/authRoutes.js"

const app = express();

dotenv.config();

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
    : [
            "http://localhost:5173",
            
            
            
            "http://localhost:3000",
            "https://expense-tracker-frontend-4.onrender.com",
            
        ];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json())

app.use("/api/v2/auth", authRouter)
app.use("/api/v2/expense", expenseRouter)

ConnectDb();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT,()=>{

    console.log(`server running on port ${PORT}`)
});
process.on("SIGINT", async() => {
    await mongoose.connection.close();
    server.close(()=>{
        console.log("server stopped");
        process.exit(1);
    })


})


