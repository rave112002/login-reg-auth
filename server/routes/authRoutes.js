import express from "express";
import {
    register,
    login,
    logout,
    sendVerificationOTP,
    verifyAccount,
    isAuthenticated,
    resetPassOTP,
    resetUserPassword,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/sendVerificationOTP", userAuth, sendVerificationOTP);

router.post("/verifyAccount", userAuth, verifyAccount);

router.post("/is-authenticated", userAuth, isAuthenticated);

router.post("/resetPassOTP", userAuth, resetPassOTP);

router.post("/resetUserPassword", userAuth, resetUserPassword);

export default router;
