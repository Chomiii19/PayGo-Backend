import User from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import sendAccountDetails from "../utils/sendAccountDetails";
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

const generateAccountNumber = (): string => {
  const timestamp = Date.now().toString().slice(-5);
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return timestamp + randomNum.toString();
};

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, checkingsBal, savingsBal, password } = req.body;

  const user = await User.create({
    name,
    email,
    checkingsBal,
    savingsBal,
    accountNumber: generateAccountNumber(),
    password,
  });

  sendAccountDetails(user.accountNumber, password, user.email);

  res.status(201).json({ status: "Success", data: user });
});

const addBalanceToUser = catchAsync(async (req, res, next) => {
  const { sourceType, amount, accountNumber } = req.body;

  const user = await User.findOne({ accountNumber });

  if (!user) return next(new AppError("User not found", 404));

  if (sourceType === "checkings") user.checkingsBal += amount;
  else if (sourceType === "savings") user.savingsBal += amount;

  await user.save();

  res.status(200).json({ status: "Success" });
});

const updateUserAccount = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("User not found", 404));

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;

  await user.save();

  res.status(200).json({
    status: "Success",
    message: "Account successfully updated",
  });
});

const addContact = catchAsync(async (req, res, next) => {
  const { name, contactNumber } = req.body;

  if (!req.user) {
    return next(new AppError("User not authenticated", 401));
  }

  if (!name || !contactNumber) {
    return next(new AppError("Name and contact number are required", 400));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.contacts.push({ name, contactNumber });

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Contact added successfully",
    contacts: user.contacts,
  });
});

export {
  getUser,
  regenerateCode,
  createUser,
  addBalanceToUser,
  updateUserAccount,
  addContact,
};
