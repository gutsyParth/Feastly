import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use("/api/auth", authRoute);
app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`);
    connectDB();
});
