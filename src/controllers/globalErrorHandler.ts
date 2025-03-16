import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const sendDevError = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR: ", err);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong!",
    });
  }
};

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "DEVELOPMENT") sendDevError(err, res);
  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = Object.assign(err);

    sendProdError(error, res);
  }
};
