import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/verify-login").post(authController.verifyLoginCode);
router.route("/validate-token").get(authController.validateToken);
router.route("/logout").get(authController.logout);

export default router;
