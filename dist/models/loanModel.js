"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var loanSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 10000 },
    balanceRemaining: { type: Number, required: true },
    termMonths: { type: Number, default: 10 },
    monthlyPayment: { type: Number, required: true },
    interestRate: { type: Number, default: 0.03 },
    paymentSource: {
        type: String,
        enum: ["checkings", "savings"],
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    nextDueDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ["active", "paid"],
        default: "active",
    },
});
var Loan = mongoose_1.default.model("Loan", loanSchema);
exports.default = Loan;
