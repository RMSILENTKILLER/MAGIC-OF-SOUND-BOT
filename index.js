/**
 * MAGIC OF SOUND BOT
 * Author: Rasel Mahmud
 * GitHub: https://github.com/RMSILENTKILLER/MAGIC-OF-SOUND-BOT
 */

const fs = require("fs");
const fse = require("fs-extra");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Load config
const config = require("./config.json");

// Initialize database
const db = new sqlite3.Database(config.DATABASE.sqlite.storage, (err) => {
  if (err) console.error("DB Error:", err);
  else console.log("Database loaded successfully.");
});

// Log bot start
console.log(`\n[✔️] ${config.BOTNAME} is starting...`);
console.log(`[✔️] Prefix: ${config.PREFIX}`);
console.log(`[✔️] Admins: ${config.ADMINBOT.join(", ")}`);
console.log("[✔️] Listening to events...\n");

// Appstate file check
const appstatePath = path.resolve(__dirname, config.APPSTATEPATH);
if (!fs.existsSync(appstatePath)) {
  fs.writeFileSync(appstatePath, JSON.stringify({}));
  console.log("[✔️] appstate.json created.");
}

// Simple message send function (simulation)
function sendMessage(userId, message) {
  console.log(`[Message to ${userId}]: ${message}`);
}

// Example: send bot started message to all admins
config.ADMINBOT.forEach(adminId => {
  sendMessage(adminId, `${config.BOTNAME} is now running!`);
});

// Load commands
const commandsDir = path.resolve(__dirname, "commands");
if (!fs.existsSync(commandsDir)) {
  fs.mkdirSync(commandsDir);
  console.log("[✔️] commands folder created.");
}

// Example command handler
function handleCommand(userId, command, args) {
  switch (command.toLowerCase()) {
    case "ping":
      sendMessage(userId, "Pong! 🏓");
      break;
    case "say":
      sendMessage(userId, args.join(" "));
      break;
    default:
      sendMessage(userId, `Unknown command: ${command}`);
  }
}

// Event listener simulation (incoming messages)
function onMessage(userId, message) {
  if (!message.startsWith(config.PREFIX)) return;
  const args = message.slice(config.PREFIX.length).trim().split(/ +/g);
  const command = args.shift();
  handleCommand(userId, command, args);
}

// Demo incoming messages
setTimeout(() => onMessage(config.ADMINBOT[0], "*ping"), 2000);
setTimeout(() => onMessage(config.ADMINBOT[0], "*say Hello World!"), 4000);

// Keep process alive
process.stdin.resume();
