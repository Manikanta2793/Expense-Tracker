import express from "express"
import cors from "cors"
import ConnectDb from "./config/database.js"
import router from "./routes/registerRoute.js"
import { expenseRouter } from "./routes/expenseRoutes.js";

const app = express();

// CORS configuration
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())

app.use("/register",router)
app.use("/api/v2/expense",expenseRouter)

ConnectDb();

const server = app.listen(3000,()=>{

    console.log("server running on port 3000")
});
process.on("SIGINT", async() => {
    await mongoose.connection.close();
    server.close(()=>{
        console.log("server stopped");
        process.exit(1);
    })


})


