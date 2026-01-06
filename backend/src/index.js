import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import ConnectDb from "./config/database.js"
import { expenseRouter } from "./routes/expenseRoutes.js";

const app = express();

// CORS configuration
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "https://expense-tracker-frontend-4.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())

app.use("/api/v2/expense",expenseRouter)

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


