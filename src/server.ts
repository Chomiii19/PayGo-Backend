import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();
const PORT = process.env.PORT || 8000;
const DB = `${process.env.DB}`.replace(
  "<db_password>",
  process.env.DB_PASSWORD as string
);

mongoose
  .connect(DB)
  .then(() => console.log("Successfully connected to DB..."))
  .catch((err) => console.error(err));

app.listen(PORT, () => console.log("Server is listening at port ", PORT));
