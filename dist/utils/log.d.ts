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
declare const log: (message: string) => void;
export default log;
