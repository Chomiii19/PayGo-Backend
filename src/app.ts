import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import appRoutes from "./routes/appRoutes";
import AppError from "./utils/appError";
import imgRoutes from "./routes/imgRoutes";
import userRoutes from "./routes/userRoutes";
import globalErrorHandler from "./controllers/globalErrorHandler";
import protect from "./middlewares/protect";

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/qrcodes", express.static(path.join(__dirname, "public", "qrcodes")));
app.use("/api/v1", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/app", protect, appRoutes);
app.use("/api/v1/img", protect, imgRoutes);
app.use("*", (req, res, next) =>
  next(new AppError(`Cannot find ${req.originalUrl} from the server`, 404))
);
app.use(globalErrorHandler);

export default app;
