import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
