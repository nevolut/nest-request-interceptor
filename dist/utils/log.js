"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Logs a message to the console with a formatted timestamp.
 *
 * The timestamp follows the format: `[ YYYY/MM/DD HH:mm:ss ]`
 *
 * @param {string} message - The message to log.
 *
 * @example
 * ```ts
 * log("Server started");
 * // Output: [ 2025/02/25 15:04:23 ] - Server started
 * ```
 */
const log = (message) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timestamp = `[ ${year}/${month}/${day} ${hours}:${minutes}:${seconds} ]`;
    console.log(`\x1b[30m${timestamp}\x1b[0m - ${message}`);
};
exports.default = log;
//# sourceMappingURL=log.js.map