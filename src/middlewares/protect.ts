import User from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import verifyToken from "../utils/verifyToken";

const protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next(new AppError("No token provided", 401));

  const decodedToken = verifyToken(token) as { id: string };
  const user = await User.findOne({ accountNumber: decodedToken.id });

  if (!user) return next(new AppError("User not found", 404));

  req.user = user;
  console.log(req.user);
  next();
});

export default protect;
