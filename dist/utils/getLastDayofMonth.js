"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getLastDayOfMonth = function (date) {
    var dt = new Date(date);
    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0]
        .slice(-2);
};
exports.default = getLastDayOfMonth;
