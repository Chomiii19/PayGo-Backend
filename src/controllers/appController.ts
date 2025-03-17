import path from "path";
import QRCode from "qrcode";
import fs from "fs";
import Loan from "../models/loanModel";
import Transaction from "../models/transactionModel";
import User from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import utcDate from "../utils/convertToUtc0";
import getLastDayOfMonth from "../utils/getLastDayofMonth";

const transaction = catchAsync(async (req, res, next) => {
  const { service, recepientNumber, amount, type, payment } = req.body;

  if (!req.user) return next(new AppError("User details not found", 404));

  if (payment === "checkings" && amount > req.user?.checkingsBal)
    return next(new AppError("Insufficient balance in checkings account", 400));

  if (payment === "savings" && amount > req.user?.savingsBal)
    return next(new AppError("Insufficient balance in savings account", 400));

  if (service === "PayGo") {
    const recepient = await User.findOne({ accountNumber: recepientNumber });
    if (!recepient) return next(new AppError("Recepient does not exist", 404));

    recepient.savingsBal += amount;
    await recepient.save();
  }

  const sender = await User.findById(req.user._id);
  if (!sender) return next(new AppError("User details not found", 404));

  if (payment === "checkings") {
    sender.checkingsBal -= amount;
  } else {
    sender.savingsBal -= amount;
  }
  await sender.save();

  const transactionDetails = await Transaction.create({
    user: req.user._id,
    type,
    service,
    recepientNumber,
    amount,
  });

  res.status(201).json({ status: "Success", data: transactionDetails });
});

const getTotalExpensesThisMonth = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User details not found", 404));

  const date = new Date().toISOString().split("T")[0];
  const lastDay = getLastDayOfMonth(date);

  const { start, end } = utcDate(
    date.slice(0, 8).concat("01"),
    date.slice(0, 8).concat(lastDay)
  );

  const result = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: "$type",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const grandTotal = result.reduce((sum, item) => sum + item.totalAmount, 0);

  const expenses = result.map((item) => ({
    type: item._id,
    totalAmount: item.totalAmount,
    percentage: grandTotal > 0 ? (item.totalAmount / grandTotal) * 100 : 0,
  }));

  res.status(200).json({
    status: "Success",
    data: { expenses, grandTotal },
  });
});

const getTotalExpensesMonthly = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User details not found", 404));

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const { start: startThisYear, end: endThisYear } = utcDate(
    `${currentYear}-01-01`,
    `${currentYear}-12-31`
  );

  const { start: startLastYear, end: endLastYear } = utcDate(
    `${lastYear}-01-01`,
    `${lastYear}-12-31`
  );

  const result = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        createdAt: {
          $gte: startThisYear,
          $lte: endThisYear,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const lastYearData = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        createdAt: { $gte: startLastYear, $lte: endLastYear },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const currentYearTotal = result.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );
  const lastYearTotal = lastYearData[0]?.totalAmount || 0;

  let percentageChange = 0;
  if (lastYearTotal > 0) {
    percentageChange =
      ((currentYearTotal - lastYearTotal) / lastYearTotal) * 100;
  }

  res.status(200).json({
    status: "Success",
    data: {
      result,
      currentYearTotal,
      lastYearTotal,
      percentageChange: percentageChange.toFixed(2),
    },
  });
});

const getTotalTransactionsYearly = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User details not found", 404));

  const currentYear = new Date().getFullYear();

  const { start, end } = utcDate(
    `${currentYear}-01-01`,
    `${currentYear}-12-31`
  );

  const result = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        $or: [
          { user: req.user._id },
          { type: "bank_transfer", recepientNumber: req.user._id.toString() },
        ],
      },
    },
    {
      $facet: {
        sentTransactions: [
          { $match: { user: req.user._id } },
          { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } },
        ],
        receivedTotal: [
          {
            $match: {
              type: "bank_transfer",
              recepientNumber: req.user._id.toString(),
            },
          },
          {
            $group: { _id: null, totalAmount: { $sum: "$amount" } },
          },
        ],
      },
    },
  ]);

  const transactionsByType = result[0].sentTransactions;
  const receiveTotalAmount = result[0].receivedTotal[0]?.totalAmount || 0;

  const loanTotal = await Loan.aggregate([
    {
      $match: {
        user: req.user._id,
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const loanTotalAmount = loanTotal[0]?.totalAmount || 0;

  const typeLabels: Record<string, string> = {
    bank_transfer: "Transfer",
    receive: "Receive",
    buy_load: "Load",
    pay_bills: "Bills",
    loan: "Loan",
  };

  const colorMap: Record<string, string> = {
    bank_transfer: "#eab308",
    receive: "#177AD5",
    buy_load: "#a855f7",
    pay_bills: "#f87171",
    loan: "#22c55e",
  };

  interface TransactionType {
    _id: string;
    totalAmount: number;
  }

  const barData = transactionsByType.map((transaction: TransactionType) => ({
    value: transaction.totalAmount,
    label: typeLabels[transaction._id] || "Unknown",
    frontColor: colorMap[transaction._id] || "#000",
  }));

  barData.push(
    {
      value: receiveTotalAmount,
      label: typeLabels.receive,
      frontColor: colorMap.receive,
    },
    {
      value: loanTotalAmount,
      label: typeLabels.loan,
      frontColor: colorMap.loan,
    }
  );

  res.status(200).json({
    status: "Success",
    data: barData,
  });
});

const getLoanDetails = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User details not found", 404));

  const loanDetails = await Loan.findOne({
    user: req.user._id,
    status: "active",
  });

  if (!loanDetails) return next(new AppError("No active loan found", 404));

  res.status(200).json({ status: "Success", data: loanDetails });
});

const getTransactionHistory = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User details not found", 404));

  const transactions = await Transaction.find({ user: req.user._id }).select(
    "amount type createdAt"
  );
  const receivedTransactions = await Transaction.find({
    recepientNumber: req.user._id.toString(),
  }).select("amount type createdAt");
  const loans = await Loan.find({ user: req.user._id }).select(
    "amount type createdAt"
  );

  const getServiceName = (type: string) => {
    if (!type) return "Sent Money";
    if (type.toLowerCase().startsWith("p")) return "Pay Bills";
    if (type.toLowerCase().startsWith("bu")) return "Buy Load";
    if (type.toLowerCase().startsWith("ba")) return "Bank Transfer";
    return "Sent Money";
  };

  const allTransactions = [
    ...transactions.map((t) => ({
      name: getServiceName(t.type),
      timestamp: t.createdAt,
      amount: t.amount,
      type: 0,
    })),
    ...receivedTransactions.map((t) => ({
      name: "Received Money",
      timestamp: t.createdAt,
      amount: t.amount,
      type: 1,
    })),
    ...loans.map((l) => ({
      name: "Loan Payment",
      timestamp: l.createdAt,
      amount: l.amount,
      type: 0,
    })),
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  res.status(200).json({
    status: "success",
    data: allTransactions,
  });
});

const applyLoan = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User details not found", 404));
  const { amount, paymentSource } = req.body;

  if (amount < 10000)
    return next(new AppError("Insufficient loan amount", 400));

  const activeLoan = await Loan.findOne({
    user: req.user._id,
    status: "active",
  });

  if (activeLoan)
    return next(new AppError("You still have an active loan", 400));

  const loanDetails = await Loan.create({
    user: req.user._id,
    amount,
    paymentSource,
    balanceRemaining: amount,
    nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.status(201).json({ status: "Success", data: loanDetails });
});

const generateQRCode = catchAsync(async (req, res, next) => {
  try {
    if (!req.user) return next(new AppError("User not authenticated", 401));

    const qrData = `${req.user._id.toString()}`;
    const qrDir = path.join(__dirname, "../public/qrcodes");
    const qrPath = path.join(
      __dirname,
      `../public/qrcodes/${req.user._id.toString()}.png`
    );

    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    if (fs.existsSync(qrPath)) {
      return res.json({ qrCodeUrl: `/qrcodes/${req.user._id.toString()}.png` });
    }

    await QRCode.toFile(qrPath, qrData, {
      errorCorrectionLevel: "H",
    });

    res.json({ qrCodeUrl: `/qrcodes/${req.user._id.toString()}.png` });
  } catch (error) {
    next(error);
  }
});

const addContacts = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User not authenticated", 401));

  const { contactId } = req.body;

  if (req.user._id.toString() === contactId) {
    return next(new AppError("You cannot add yourself as a contact", 400));
  }

  const contact = await User.findById(contactId);
  if (!contact) return next(new AppError("User not found", 404));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { contacts: contactId } },
    { new: true }
  );

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    message: "Contact added successfully",
    contacts: user.contacts,
  });
});

export {
  transaction,
  getTotalExpensesMonthly,
  getTotalExpensesThisMonth,
  getTotalTransactionsYearly,
  getLoanDetails,
  getTransactionHistory,
  applyLoan,
  generateQRCode,
  addContacts,
};
