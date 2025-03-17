import User from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import sendCodeVerification from "../utils/sendCodeVerification";

const getUser = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User not logged in", 403));

  const user = await User.findById(req.user._id);

  console.log(user);
  if (!user)
    return next(
      new AppError("The user belonging with this token doesn't exist", 404)
    );

  res.status(200).json({ data: { user } });
});

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const regenerateCode = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User not logged in", 403));

  const user = await User.findById(req.user._id);

  if (!user)
    return next(
      new AppError("The user belonging with this token doesn't exist", 404)
    );

  user.verificationCode = {
    code: generateCode(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  };
  await user.save();

  sendCodeVerification(user);
  res.status(200).json({ data: { user } });
});

export { getUser, regenerateCode };
