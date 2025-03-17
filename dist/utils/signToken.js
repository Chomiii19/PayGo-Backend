"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var signToken = function (id) {
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("Secret key is not defined in environment variables");
    }
    return jsonwebtoken_1.default.sign({ id: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: Number(process.env.JWT_EXPIRES_AT),
    });
};
exports.default = signToken;
