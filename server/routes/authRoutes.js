import express from "express";
import { connectionToDB } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const db = await connectionToDB();
        const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [
            email,
        ]);

        if (rows.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await db.query(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashPassword]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ message: "Database connection error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectionToDB();
        const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [
            email,
        ]);

        if (rows.length === 0) {
            return res.status(409).json({ message: "User not exists" });
        }

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong Password" });
        }

        const token = jwt.sign({ id: rows[0].id }, process.env.JWT_KEY, {
            expiresIn: "1h",
        });

        res.status(201).json({ token: token });
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ message: "Database connection error" });
    }
});

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "Token is required" });
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Token verification error" });
    }
};

router.get("/home", verifyToken, async (req, res) => {});

export default router;
