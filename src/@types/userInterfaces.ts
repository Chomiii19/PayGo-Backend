import { Document } from "mongoose";

interface IContact {
  name: string;
  contactNumber: string;
}

interface IUser extends Document {
  _id: number;
  name: string;
  accountNumber: string;
  email: string;
  checkingsBal: number;
  savingsBal: number;
  password: string;
  contacts: IContact[];
  profilePictureUrl: string;
  verificationCode: { code: String; expiresAt: Date };
  comparePassword(password: string): Promise<boolean>;
}

export { IUser };
