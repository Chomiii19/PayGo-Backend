import express from "express";
import * as userController from "../controllers/userController";
import protect from "../middlewares/protect";

const router = express.Router();

router.route("/get-user").get(protect, userController.getUser);
router.route("/generate-code").get(protect, userController.regenerateCode);
router.route("/create").post(userController.createUser);
router.route("/add-balance").patch(userController.addBalanceToUser);
router.route("/update").patch(userController.updateUserAccount);
router.route("/add-contact").post(protect, userController.addContact);

export default router;
