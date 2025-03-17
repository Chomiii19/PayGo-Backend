import { Response } from "express";
import User from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import signToken from "../utils/signToken";
import verifyToken from "../utils/verifyToken";
import sendCodeVerification from "../utils/sendCodeVerification";

const createSendToken = (id: string, statusCode: number, res: Response) => {
  const token = signToken(id);

  const cookieOption = {
    maxAge: Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none" as "none",
    path: "/",
  };

  res.cookie("authToken", token, cookieOption);
  res.status(statusCode).json({ status: "Success", token });
};

const generateAccountNumber = (): string => {
  const timestamp = Date.now().toString().slice(-5);
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return timestamp + randomNum.toString();
};

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const login = catchAsync(async (req, res, next) => {
  const { accountNumber, password } = req.body;

  if (!accountNumber || !password)
    return next(new AppError("Input is required", 400));

  const user = await User.findOne({ accountNumber }).select("+password");
  console.log(user);
  if (!user || !(await user.comparePassword(password)))
    return next(new AppError("Invalid credentials", 400));

  user.verificationCode = {
    code: generateCode(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  };
  await user.save();

  sendCodeVerification(user);
  createSendToken(user.accountNumber, 200, res);
});

const validateToken = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next(new AppError("No user token", 404));

  const decodedToken = verifyToken(token) as { id: string };
  const user = await User.findOne({ accountNumber: decodedToken.id });

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({ status: "Success" });
});

const verifyLoginCode = catchAsync(async (req, res, next) => {
  const { verificationCode } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next(new AppError("No user token", 404));
  if (!verificationCode)
    return next(new AppError("Verification code is required", 400));

  const decodedToken = verifyToken(token) as { id: string };
  const user = await User.findOne({ accountNumber: decodedToken.id });

  if (!user) return next(new AppError("User not found", 404));

  if (user.verificationCode.expiresAt < new Date())
    return next(new AppError("Code has already expired", 400));

  if (user.verificationCode.code !== verificationCode)
    return next(new AppError("Invalid verification code.", 400));

  res.status(200).json({ status: "Success", data: user });
});

const logout = catchAsync(async (req, res, next) => {
  res
    .status(200)
    .json({ status: "Success", message: "Logged out successfully" });
});

export { login, verifyLoginCode, validateToken, logout };
