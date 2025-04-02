import { connectionToDB } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
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

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome",
            text: `Hello ${username},\n\nThank you for registering with us!`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ message: "Database connection error" });
    }
};

export const login = async (req, res) => {
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

        const token = jwt.sign({ id: rows[0].userId }, process.env.JWT_KEY, {
            expiresIn: "1d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json({ message: "User logged in successfully" });
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ message: "Database connection error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
        });

        return res
            .status(200)
            .json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ message: "Database connection error" });
    }
};

export const sendVerificationOTP = async (req, res) => {
    const { userId } = req.body;

    try {
        const db = await connectionToDB();
        const [rows] = await db.query(`SELECT * FROM users WHERE userId = ?`, [
            userId,
        ]);

        if (rows.length === 0) {
            return res.status(409).json({ message: "User not exists" });
        }

        if (rows[0].isAccountVerified) {
            return res.status(409).json({ message: "User already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db.query(
            `UPDATE users SET verifyOTP = ?, verifyOTPExpireAt = ? WHERE userId = ?`,
            [otp, expiryDate, userId]
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: rows[0].email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. It is valid for 24 hours. Verify your account using this OTP.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ message: "Database connection error" });
    }
};

export const verifyAccount = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const db = await connectionToDB();
        const [rows] = await db.query(`SELECT * FROM users WHERE userId = ?`, [
            userId,
        ]);

        if (rows.length === 0) {
            return res.status(409).json({ message: "User not exists" });
        }

        if (rows[0].verifyOTP === "" || rows[0].verifyOTP !== otp) {
            return res.status(409).json({ message: "Invalid OTP" });
        }

        if (rows[0].otpExpireAt < Date.now()) {
            return res.status(409).json({ message: "OTP expired" });
        }

        await db.query(
            `UPDATE users SET isAccountVerified = true, verifyOTP = '', verifyOTPExpireAt = null WHERE userId = ?`,
            [userId]
        );

        return res
            .status(200)
            .json({ message: "Account verified successfully" });
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ message: "Database connection error" });
    }
};

export const resetPassOTP = async (req, res) => {
    const { userId } = req.body;

    try {
        const db = await connectionToDB();
        const [rows] = await db.query(`SELECT * FROM users WHERE userId = ?`, [
            userId,
        ]);

        if (rows.length === 0) {
            return res.status(409).json({ message: "User not exists" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        await db.query(
            `UPDATE users SET resetPassOTP = ?, resetPassOTPExpireAt = ? WHERE userId = ?`,
            [otp, expiryDate, userId]
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: rows[0].email,
            subject: "Reset Password OTP",
            text: `Your OTP for resetting password is ${otp}. It is valid for 5 minutes. Use this OTP to proceed with resetting your password.`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            message: "Reset password OTP sent successfully",
        });
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ message: "Database connection error" });
    }
};

export const resetUserPassword = async (req, res) => {
    const { userId, otp, newPassword } = req.body;

    if (!userId || !otp || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const db = await connectionToDB();
        const [rows] = await db.query(`SELECT * FROM users WHERE userId = ?`, [
            userId,
        ]);

        if (rows.length === 0) {
            return res.status(409).json({ message: "User not exists" });
        }

        if (rows[0].resetPassOTP === "" || rows[0].resetPassOTP !== otp) {
            return res.status(409).json({ message: "Invalid OTP" });
        }

        if (rows[0].resetPassOTPExpireAt < Date.now()) {
            return res.status(409).json({ message: "OTP expired" });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        await db.query(
            `UPDATE users SET password = ?, resetPassOTP = '', resetPassOTPExpireAt = null WHERE userId = ?`,
            [hashPassword, userId]
        );

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ message: "User is authenticated" });
    } catch (error) {
        clgger.error("Database connection error:", error);
        return res.status(500).json({ message: "Database connection error" });
    }
};
