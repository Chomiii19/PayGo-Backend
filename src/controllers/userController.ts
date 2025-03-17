import User from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

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

export { getUser };
