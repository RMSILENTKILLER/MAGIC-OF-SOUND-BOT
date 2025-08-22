// index.js - Entry point for ༊✨MAGIC🔹OF🔸SOUND✨᯾ Bot

const { spawn } = require("child_process");
const express = require("express");
const path = require("path");
const logger = require("./utils/log");
const axios = require("axios");
const fs = require("fs");

///////////////////////////////////////////////////////////
//========= Web dashboard / uptime server =========//
///////////////////////////////////////////////////////////

const app = express();
const port = process.env.PORT || 8080;

// Serve a simple HTML dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    logger(`Server running on port ${port}`, "[Starting]");
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        logger(`Permission denied for port ${port}`, "[Error]");
    } else {
        logger(`Server error: ${err.message}`, "[Error]");
    }
});

///////////////////////////////////////////////////////////
//========= Start bot and auto-restart loop =========//
///////////////////////////////////////////////////////////

global.restartCount = global.restartCount || 0;

function startBot(message) {
    if (message) logger(message, "[Starting]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "magic.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (code) => {
        if (code !== 0 && global.restartCount < 5) {
            global.restartCount += 1;
            logger(`Bot exited with code ${code}. Restarting (${global.restartCount}/5)...`, "[Restarting]");
            startBot();
        } else {
            logger(`Bot stopped after ${global.restartCount} restarts.`, "[Stopped]");
        }
    });

    child.on("error", (err) => {
        logger(`Error occurred: ${JSON.stringify(err)}`, "[Error]");
    });
}

///////////////////////////////////////////////////////////
//========= Check updates from GitHub =========//
///////////////////////////////////////////////////////////

const updateURL = "https://raw.githubusercontent.com/RMSILENTKILLER/MAGIC-OF-SOUND-BOT/main/data.json";

axios.get(updateURL)
    .then((res) => {
        const data = res.data;
        logger(`Bot Name: ${data.name}`, "[NAME]");
        logger(`Version: ${data.version}`, "[VERSION]");
        logger(`Description: ${data.description}`, "[DESCRIPTION]");
    })
    .catch((err) => {
        logger(`Failed to fetch update info: ${err.message}`, "[Update Error]");
    });

///////////////////////////////////////////////////////////
//========= Launch the bot =========//
///////////////////////////////////////////////////////////

startBot("Launching ༊✨MAGIC🔹OF🔸SOUND✨᯾ Bot...");
