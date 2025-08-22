// includes/listen.js

const fs = require("fs");
const path = require("path");
const log = require("./utils/log");
const config = require("../config.json");

module.exports = async function listen(client) {
    try {
        // Listen for messages
        client.on("message", async (event) => {
            try {
                // Ignore messages from the bot itself
                if (event.senderID === client.userID) return;

                // Log incoming message
                log(`[📩] Message received from ${event.senderName}: ${event.body}`, "[Message]");

                // Process command if message starts with prefix
                if (event.body.startsWith(config.PREFIX)) {
                    const args = event.body.slice(config.PREFIX.length).trim().split(/ +/);
                    const commandName = args.shift().toLowerCase();

                    // Load command file dynamically
                    const commandPath = path.join(__dirname, "commands", `${commandName}.js`);
                    if (fs.existsSync(commandPath)) {
                        const command = require(commandPath);
                        await command.run({ event, client, args, config });
                    } else {
                        log(`[⚠️] Command not found: ${commandName}`, "[Command]");
                    }
                }
            } catch (err) {
                log(`[❌] Error handling message: ${err}`, "[Error]");
            }
        });

        log("[✅] Listen module initialized and running", "[Listen]");
    } catch (err) {
        log(`[❌] Failed to initialize listen module: ${err}`, "[Error]");
    }
};
