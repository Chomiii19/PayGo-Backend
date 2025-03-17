"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utcDate = function (dateStart, dateEnd) {
    var startDate = new Date(dateStart);
    var start = new Date(startDate.getTime() - -8 * 60 * 60 * 1000);
    var adjustEndDate = new Date("".concat(dateEnd, "T23:59:59.999Z"));
    var end = new Date(adjustEndDate.getTime() - -8 * 60 * 60 * 1000);
    return { start: start, end: end };
};
exports.default = utcDate;
