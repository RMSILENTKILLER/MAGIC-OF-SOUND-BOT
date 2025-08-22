// magic.js - Core logic for ༊✨MAGIC🔹OF🔸SOUND✨᯾ Bot

const fca = require("fca-unofficial"); // Facebook Chat API
const fs = require("fs");
const logger = require("./utils/log");
const path = require("path");

// Bot configuration
const CONFIG = {
    name: "༊✨MAGIC🔹OF🔸SOUND✨᯾",
    owner: "Rasel Mahmud",
    fbAccounts: [
        { id: "61571550050635", url: "https://www.facebook.com/raselmahmud.q" },
        { id: "100024220812646", url: "https://www.facebook.com/iiii.482394" }
    ],
    sessionFile: path.join(__dirname, "appstate.json")
};

// Login function
function loginBot() {
    let appState = [];
    if (fs.existsSync(CONFIG.sessionFile)) {
        appState = JSON.parse(fs.readFileSync(CONFIG.sessionFile));
        logger("Using existing appstate for login", "[INFO]");
    }

    fca({ appState, selfListen: true }, (err, api) => {
        if (err) return logger(`Login failed: ${err.message}`, "[ERROR]");

        logger(`Logged in as ${CONFIG.name}`, "[SUCCESS]");

        // Save appState for future login
        fs.writeFileSync(CONFIG.sessionFile, JSON.stringify(api.getAppState()));
        logger("AppState saved successfully", "[INFO]");

        // Listen to incoming messages
        api.listen((err, event) => {
            if (err) return logger(`Listen error: ${err.message}`, "[ERROR]");

            // Handle messages
            if (event.type === "message") {
                handleMessage(api, event);
            }
        });
    });
}

// Message handler
function handleMessage(api, event) {
    const senderID = event.senderID;
    const message = event.body;

    // Ignore messages from bot itself
    if (CONFIG.fbAccounts.some(acc => acc.id === senderID)) return;

    logger(`[MESSAGE] From: ${senderID} | Message: ${message}`, "[MESSAGE]");

    // Simple command example
    if (message.toLowerCase() === "hi bot") {
        api.sendMessage(`Hello! I am ${CONFIG.name}. How can I assist you today?`, event.threadID);
    }
}

// Start the bot
loginBot();
