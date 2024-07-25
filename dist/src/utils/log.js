"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const Log = message => {
    message = `\x1b[30m[ ${moment().format("YYYY/MM/DD HH:mm:ss")} ]\x1b[0m - ${message}`;
    console.log(message);
};
exports.default = Log;
//# sourceMappingURL=log.js.map