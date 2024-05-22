"use strict";
exports.__esModule = true;
var moment = require("moment");
var log = function (message) {
    message = "\u001B[30m[ ".concat(moment().format("YYYY/MM/DD HH:mm:ss"), " ]\u001B[0m - ").concat(message);
    console.log(message);
};
exports["default"] = log;
