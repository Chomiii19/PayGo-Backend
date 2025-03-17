import express from "express";
import * as appController from "../controllers/appController";

const router = express.Router();

router.route("/transaction").post(appController.transaction);
router
  .route("/expenses/this-month")
  .get(appController.getTotalExpensesThisMonth);
router.route("/expenses/monthly").get(appController.getTotalExpensesMonthly);
router
  .route("/transactions/yearly")
  .get(appController.getTotalTransactionsYearly);
router.route("/loan/details").get(appController.getLoanDetails);
router.route("/transaction-history").get(appController.getTransactionHistory);
router.route("/apply-loan").post(appController.applyLoan);
router.route("/active-loan").get(appController.getActiveLoan);
router.route("/generate-qrcode").get(appController.generateQRCode);
router.route("/add-contatcs").patch(appController.addContacts);

export default router;
