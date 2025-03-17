"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var transactionSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ["pay_bills", "buy_load", "bank_transfer"],
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
    recepientNumber: {
        type: String,
        required: true,
    },
    payment: {
        type: String,
        enum: ["checkings", "savings"],
    },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});
var Transaction = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = Transaction;
