"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var authRoutes_1 = __importDefault(require("./routes/authRoutes"));
var appRoutes_1 = __importDefault(require("./routes/appRoutes"));
var appError_1 = __importDefault(require("./utils/appError"));
var imgRoutes_1 = __importDefault(require("./routes/imgRoutes"));
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var globalErrorHandler_1 = __importDefault(require("./controllers/globalErrorHandler"));
var protect_1 = __importDefault(require("./middlewares/protect"));
var app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", authRoutes_1.default);
app.use("/api/v1/user", protect_1.default, userRoutes_1.default);
app.use("/api/v1/app", protect_1.default, appRoutes_1.default);
app.use("/api/v1/img", protect_1.default, imgRoutes_1.default);
app.use("*", function (req, res, next) {
    return next(new appError_1.default("Cannot find ".concat(req.originalUrl, " from the server"), 404));
});
app.use(globalErrorHandler_1.default);
exports.default = app;
