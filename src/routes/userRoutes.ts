import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router.route("/get-user").get(userController.getUser);
router.route("/generate-code").get(userController.regenerateCode);
router.route("/create").get(userController.createUser);
router.route("/add-balance").get(userController.addBalanceToUser);

export default router;
