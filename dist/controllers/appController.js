"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContacts = exports.generateQRCode = exports.applyLoan = exports.getTransactionHistory = exports.getLoanDetails = exports.getTotalTransactionsYearly = exports.getTotalExpensesThisMonth = exports.getTotalExpensesMonthly = exports.transaction = void 0;
var path_1 = __importDefault(require("path"));
var qrcode_1 = __importDefault(require("qrcode"));
var fs_1 = __importDefault(require("fs"));
var loanModel_1 = __importDefault(require("../models/loanModel"));
var transactionModel_1 = __importDefault(require("../models/transactionModel"));
var userModel_1 = __importDefault(require("../models/userModel"));
var appError_1 = __importDefault(require("../utils/appError"));
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var convertToUtc0_1 = __importDefault(require("../utils/convertToUtc0"));
var getLastDayofMonth_1 = __importDefault(require("../utils/getLastDayofMonth"));
var transaction = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, service, recepientNumber, amount, type, payment, recepient, transactionDetails;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, service = _a.service, recepientNumber = _a.recepientNumber, amount = _a.amount, type = _a.type, payment = _a.payment;
                if (!req.user)
                    return [2 /*return*/, next(new appError_1.default("User details not found", 404))];
                if (payment === "checkings" && amount > ((_b = req.user) === null || _b === void 0 ? void 0 : _b.checkingsBal))
                    return [2 /*return*/, next(new appError_1.default("Insufficient balance in checkings account", 400))];
                if (payment === "savings" && amount > ((_c = req.user) === null || _c === void 0 ? void 0 : _c.savingsBal))
                    return [2 /*return*/, next(new appError_1.default("Insufficient balance in savings account", 400))];
                if (!(service === "PayGo")) return [3 /*break*/, 2];
                return [4 /*yield*/, userModel_1.default.findById(recepientNumber)];
            case 1:
                recepient = _d.sent();
                if (!recepient)
                    return [2 /*return*/, next(new appError_1.default("Recepient does not exist", 404))];
                _d.label = 2;
            case 2: return [4 /*yield*/, transactionModel_1.default.create({
                    user: req.user._id,
                    type: type,
                    service: service,
                    recepientNumber: recepientNumber,
                    amount: amount,
                })];
            case 3:
                transactionDetails = _d.sent();
                res.status(201).json({ status: "Success", data: transactionDetails });
                return [2 /*return*/];
        }
    });
}); });
exports.transaction = transaction;
var getTotalExpensesThisMonth = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var date, lastDay, _a, start, end, result, grandTotal;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, next(new appError_1.default("User details not found", 404))];
                date = new Date().toISOString().split("T")[0];
                lastDay = (0, getLastDayofMonth_1.default)(date);
                _a = (0, convertToUtc0_1.default)(date.slice(0, 8).concat("01"), date.slice(0, 8).concat(lastDay)), start = _a.start, end = _a.end;
                return [4 /*yield*/, transactionModel_1.default.aggregate([
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
                    ])];
            case 1:
                result = _b.sent();
                grandTotal = result.reduce(function (sum, item) { return sum + item.totalAmount; }, 0);
                res.status(200).json({
                    status: "Success",
                    data: { result: result, grandTotal: grandTotal },
                });
                return [2 /*return*/];
        }
    });
}); });
exports.getTotalExpensesThisMonth = getTotalExpensesThisMonth;
var getTotalExpensesMonthly = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var currentYear, lastYear, _a, startThisYear, endThisYear, _b, startLastYear, endLastYear, result, lastYearData, currentYearTotal, lastYearTotal, percentageChange;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, next(new appError_1.default("User details not found", 404))];
                currentYear = new Date().getFullYear();
                lastYear = currentYear - 1;
                _a = (0, convertToUtc0_1.default)("".concat(currentYear, "-01-01"), "".concat(currentYear, "-12-31")), startThisYear = _a.start, endThisYear = _a.end;
                _b = (0, convertToUtc0_1.default)("".concat(lastYear, "-01-01"), "".concat(lastYear, "-12-31")), startLastYear = _b.start, endLastYear = _b.end;
                return [4 /*yield*/, transactionModel_1.default.aggregate([
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
                    ])];
            case 1:
                result = _d.sent();
                return [4 /*yield*/, transactionModel_1.default.aggregate([
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
                    ])];
            case 2:
                lastYearData = _d.sent();
                currentYearTotal = result.reduce(function (sum, item) { return sum + item.totalAmount; }, 0);
                lastYearTotal = ((_c = lastYearData[0]) === null || _c === void 0 ? void 0 : _c.totalAmount) || 0;
                percentageChange = 0;
                if (lastYearTotal > 0) {
                    percentageChange =
                        ((currentYearTotal - lastYearTotal) / lastYearTotal) * 100;
                }
                res.status(200).json({
                    status: "Success",
                    data: {
                        result: result,
                        currentYearTotal: currentYearTotal,
                        lastYearTotal: lastYearTotal,
                        percentageChange: percentageChange.toFixed(2),
                    },
                });
                return [2 /*return*/];
        }
    });
}); });
exports.getTotalExpensesMonthly = getTotalExpensesMonthly;
var getTotalTransactionsYearly = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var currentYear, _a, start, end, result, transactionsByType, receiveTotalAmount, loanTotal, loanTotalAmount;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, next(new appError_1.default("User details not found", 404))];
                currentYear = new Date().getFullYear();
                _a = (0, convertToUtc0_1.default)("".concat(currentYear, "-01-01"), "".concat(currentYear, "-12-31")), start = _a.start, end = _a.end;
                return [4 /*yield*/, transactionModel_1.default.aggregate([
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
                    ])];
            case 1:
                result = _d.sent();
                transactionsByType = result[0].sentTransactions;
                receiveTotalAmount = ((_b = result[0].receivedTotal[0]) === null || _b === void 0 ? void 0 : _b.totalAmount) || 0;
                return [4 /*yield*/, loanModel_1.default.aggregate([
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
                    ])];
            case 2:
                loanTotal = _d.sent();
                loanTotalAmount = ((_c = loanTotal[0]) === null || _c === void 0 ? void 0 : _c.totalAmount) || 0;
                res.status(200).json({
                    status: "Success",
                    data: { transactionsByType: transactionsByType, receiveTotalAmount: receiveTotalAmount, loanTotalAmount: loanTotalAmount },
                });
                return [2 /*return*/];
        }
    });
}); });
exports.getTotalTransactionsYearly = getTotalTransactionsYearly;
var getLoanDetails = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var loanDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, next(new appError_1.default("User details not found", 404))];
                return [4 /*yield*/, loanModel_1.default.findOne({
                        user: req.user._id,
                        status: "active",
                    })];
            case 1:
                loanDetails = _a.sent();
                if (!loanDetails)
                    return [2 /*return*/, next(new appError_1.default("No active loan found", 404))];
                res.status(200).json({ status: "Success", data: loanDetails });
                return [2 /*return*/];
        }
    });
}); });
exports.getLoanDetails = getLoanDetails;
var getTransactionHistory = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, receivedTransactions, loans, allTransactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, next(new appError_1.default("User details not found", 404))];
                return [4 /*yield*/, transactionModel_1.default.find({ user: req.user._id })];
            case 1:
                transactions = _a.sent();
                return [4 /*yield*/, transactionModel_1.default.find({
                        recepientNumber: req.user._id.toString(),
                    })];
            case 2:
                receivedTransactions = _a.sent();
                return [4 /*yield*/, loanModel_1.default.find({ user: req.user._id })];
            case 3:
                loans = _a.sent();
                allTransactions = __spreadArray(__spreadArray(__spreadArray([], transactions, true), receivedTransactions, true), loans, true).sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); });
                res.status(200).json({
                    status: "success",
                    data: allTransactions,
                });
                return [2 /*return*/];
        }
    });
}); });
exports.getTransactionHistory = getTransactionHistory;
var applyLoan = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, paymentSource, activeLoan, loanDetails;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, next(new appError_1.default("User details not found", 404))];
                _a = req.body, amount = _a.amount, paymentSource = _a.paymentSource;
                if (amount < 10000)
                    return [2 /*return*/, next(new appError_1.default("Insufficient loan amount", 400))];
                return [4 /*yield*/, loanModel_1.default.findOne({
                        user: req.user._id,
                        status: "active",
                    })];
            case 1:
                activeLoan = _b.sent();
                if (activeLoan)
                    return [2 /*return*/, next(new appError_1.default("You still have an active loan", 400))];
                return [4 /*yield*/, loanModel_1.default.create({
                        user: req.user._id,
                        amount: amount,
                        paymentSource: paymentSource,
                        balanceRemaining: amount,
                        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    })];
            case 2:
                loanDetails = _b.sent();
                res.status(201).json({ status: "Success", data: loanDetails });
                return [2 /*return*/];
        }
    });
}); });
exports.applyLoan = applyLoan;
var generateQRCode = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var qrData, qrDir, qrPath, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.user)
                    return [2 /*return*/, next(new appError_1.default("User not authenticated", 401))];
                qrData = "".concat(req.user._id.toString());
                qrDir = path_1.default.join(__dirname, "../public/qrcodes");
                qrPath = path_1.default.join(__dirname, "../public/qrcodes/".concat(req.user._id.toString(), ".png"));
                if (!fs_1.default.existsSync(qrDir)) {
                    fs_1.default.mkdirSync(qrDir, { recursive: true });
                }
                if (fs_1.default.existsSync(qrPath)) {
                    return [2 /*return*/, res.json({ qrCodeUrl: "/qrcodes/".concat(req.user._id.toString(), ".png") })];
                }
                return [4 /*yield*/, qrcode_1.default.toFile(qrPath, qrData, {
                        errorCorrectionLevel: "H",
                    })];
            case 1:
                _a.sent();
                res.json({ qrCodeUrl: "/qrcodes/".concat(req.user._id.toString(), ".png") });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.generateQRCode = generateQRCode;
var addContacts = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contactId, contact, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, next(new appError_1.default("User not authenticated", 401))];
                contactId = req.body.contactId;
                if (req.user._id.toString() === contactId) {
                    return [2 /*return*/, next(new appError_1.default("You cannot add yourself as a contact", 400))];
                }
                return [4 /*yield*/, userModel_1.default.findById(contactId)];
            case 1:
                contact = _a.sent();
                if (!contact)
                    return [2 /*return*/, next(new appError_1.default("User not found", 404))];
                return [4 /*yield*/, userModel_1.default.findByIdAndUpdate(req.user._id, { $addToSet: { contacts: contactId } }, { new: true })];
            case 2:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, next(new appError_1.default("User not found", 404))];
                res.status(200).json({
                    status: "success",
                    message: "Contact added successfully",
                    contacts: user.contacts,
                });
                return [2 /*return*/];
        }
    });
}); });
exports.addContacts = addContacts;
