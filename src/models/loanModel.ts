import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, default: "loan" },
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

const Loan = mongoose.model("Loan", loanSchema);
export default Loan;
