"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sendDevError = function (err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};
var sendProdError = function (err, res) {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        console.error("ERROR: ", err);
        res.status(500).json({
            status: "Error",
            message: "Something went wrong!",
        });
    }
};
exports.default = (function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";
    if (process.env.NODE_ENV === "DEVELOPMENT")
        sendDevError(err, res);
    if (process.env.NODE_ENV === "PRODUCTION") {
        var error = Object.assign(err);
        sendProdError(error, res);
    }
});
