import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { connectionToDB } from "./config/db.js";

const port = process.env.PORT || 4000;
connectionToDB();

const app = express();
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
    "API WORKING!";
});

app.listen(process.env.PORT, () => {
    console.log("Server is running on port ", port);
});
