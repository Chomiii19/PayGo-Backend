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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.validateToken = exports.verifyLoginCode = exports.login = void 0;
var userModel_1 = __importDefault(require("../models/userModel"));
var appError_1 = __importDefault(require("../utils/appError"));
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var signToken_1 = __importDefault(require("../utils/signToken"));
var verifyToken_1 = __importDefault(require("../utils/verifyToken"));
var sendCodeVerification_1 = __importDefault(require("../utils/sendCodeVerification"));
var createSendToken = function (id, statusCode, res) {
    var token = (0, signToken_1.default)(id);
    var cookieOption = {
        maxAge: Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    };
    res.cookie("authToken", token, cookieOption);
    res.status(statusCode).json({ status: "Success", token: token });
};
var generateCode = function () {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
var login = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, accountNumber, password, user, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, accountNumber = _a.accountNumber, password = _a.password;
                if (!accountNumber || !password)
                    return [2 /*return*/, next(new appError_1.default("Invalid credentials", 400))];
                return [4 /*yield*/, userModel_1.default.findById(accountNumber).select("+password")];
            case 1:
                user = _c.sent();
                _b = !user;
                if (_b) return [3 /*break*/, 3];
                return [4 /*yield*/, user.comparePassword(password)];
            case 2:
                _b = !(_c.sent());
                _c.label = 3;
            case 3:
                if (_b)
                    return [2 /*return*/, next(new appError_1.default("Invalid credentials", 400))];
                user.verificationCode = {
                    code: generateCode(),
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                };
                return [4 /*yield*/, user.save()];
            case 4:
                _c.sent();
                (0, sendCodeVerification_1.default)(user);
                createSendToken(user._id, 200, res);
                return [2 /*return*/];
        }
    });
}); });
exports.login = login;
var validateToken = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decodedToken, user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token)
                    return [2 /*return*/, next(new appError_1.default("No user token", 404))];
                decodedToken = (0, verifyToken_1.default)(token);
                return [4 /*yield*/, userModel_1.default.findById(decodedToken.id)];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, next(new appError_1.default("User not found", 404))];
                res.status(200).json({ status: "Success" });
                return [2 /*return*/];
        }
    });
}); });
exports.validateToken = validateToken;
var verifyLoginCode = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var verificationCode, token, decodedToken, user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                verificationCode = req.body.verificationCode;
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token)
                    return [2 /*return*/, next(new appError_1.default("No user token", 404))];
                if (!verificationCode)
                    return [2 /*return*/, next(new appError_1.default("Verification code is required", 400))];
                decodedToken = (0, verifyToken_1.default)(token);
                return [4 /*yield*/, userModel_1.default.findById(decodedToken.id)];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, next(new appError_1.default("User not found", 404))];
                if (user.verificationCode.expiresAt < new Date())
                    return [2 /*return*/, next(new appError_1.default("Code has already expired", 400))];
                if (user.verificationCode.code !== verificationCode)
                    return [2 /*return*/, next(new appError_1.default("Invalid verification code.", 400))];
                res.status(200).json({ status: "Success", data: user });
                return [2 /*return*/];
        }
    });
}); });
exports.verifyLoginCode = verifyLoginCode;
var logout = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res
            .status(200)
            .json({ status: "Success", message: "Logged out successfully" });
        return [2 /*return*/];
    });
}); });
exports.logout = logout;
