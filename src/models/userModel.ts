import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";
import { IUser } from "../@types/userInterfaces";

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    unique: true,
  },
  accountNumber: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: 4,
    select: false,
  },
  checkingsBal: {
    type: Number,
    default: 0,
  },
  savingsBal: {
    type: Number,
    default: 0,
  },
  profilePictureUrl: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "A user must have an email"],
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  contacts: {
    type: [
      {
        name: String,
        contactNumber: String,
      },
    ],
  },
  verificationCode: {
    code: String,
    expiresAt: Date,
  },
});

// @ts-ignore
userSchema.pre("save", async function (this: IUser, next: NextFunction) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("user", userSchema);
export default User;
