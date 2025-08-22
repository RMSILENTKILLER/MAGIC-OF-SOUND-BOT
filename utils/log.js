// utils/log.js

const chalk = require("chalk");

/**
 * Custom logger for MAGIC-OF-SOUND-BOT
 * Prints messages with timestamp and colored labels
 * @param {string} message - Message to display
 * @param {string} label - Optional label (default: "[MAGIC INFO]")
 */
function logger(message, label = "[✨MAGIC INFO✨]") {
    const timestamp = new Date().toLocaleString();
    console.log(
        `${chalk.cyan(`[ ${timestamp} ]`)} ${chalk.magenta(label)} ${chalk.white(message)}`
    );
}

/**
 * Predefined logger types for convenience
 */
logger.info = (msg) => logger(msg, "[✨MAGIC INFO✨]");
logger.warn = (msg) => logger(msg, "[⚠️ MAGIC WARN ⚠️]");
logger.error = (msg) => logger(msg, "[❌ MAGIC ERROR ❌]");
logger.success = (msg) => logger(msg, "[✅ MAGIC SUCCESS ✅]");

module.exports = logger;
