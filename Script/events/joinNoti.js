
module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "Rasel Mahmud",
  description: "Notification of bots or people entering groups with random gif/photo/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "pidusage": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const path = join(__dirname, "cache", "joinvideo");
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
  const path2 = join(__dirname, "cache", "joinvideo", "randomgif");
  if (!existsSync(path2)) mkdirSync(path2, { recursive: true });
};

module.exports.run = async function ({ api, event }) {
  const { join } = global.nodemodule["path"];
  const { threadID } = event;

  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " " : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    const fs = require("fs");

    return api.sendMessage("", event.threadID, () =>
      api.sendMessage({
        body: `✨💙 𝙰𝚂𝚂𝙰𝙻𝙰𝙼𝚄 𝙰𝙻𝙰𝙸𝙺𝚄𝙼 💙✨  
🌸 𝙂𝚛𝚊𝚝𝚎𝚏𝚞𝚕 𝚝𝚘 𝚓𝚘𝚒𝚗 𝚝𝚑𝚒𝚜 𝚊𝚖𝚊𝚣𝚒𝚗𝚐 𝚐𝚛𝚘𝚞𝚙! 🩷  
💫 𝙸 𝚠𝚒𝚕𝚕 𝚍𝚘 𝚖𝚢 𝚋𝚎𝚜𝚝 𝚝𝚘 𝚜𝚑𝚊𝚛𝚎 𝚙𝚘𝚜𝚒𝚝𝚒𝚟𝚒𝚝𝚢, 𝙸𝚗 𝚂𝚑𝚊 𝙰𝚕𝚕𝚊𝚑 ✨  

📌 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜: ${global.config.PREFIX}help | ${global.config.PREFIX}menu

𝐁𝐎𝐓 𝐍𝐀𝐌𝐄: ༊✨𝐌𝐀𝐆𝐈𝐂🔹𝐎𝐅🔸𝐒𝐎𝐔𝐍𝐃✨᯾`,
        attachment: fs.createReadStream(__dirname + "/cache/ullash.mp4")
      }, threadID));
  } else {
    try {
      const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);
      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      const path = join(__dirname, "cache", "joinvideo");
      const pathGif = join(path, `${threadID}.video`);

      var mentions = [], nameArray = [], memLength = [], i = 0;
      for (let id in event.logMessageData.addedParticipants) {
        const userName = event.logMessageData.addedParticipants[id].fullName;
        nameArray.push(userName);
        mentions.push({ tag: userName, id: event.logMessageData.addedParticipants[id].userFbId });
        memLength.push(participantIDs.length - i++);
      }

      memLength.sort((a, b) => a - b);

      let msg = threadData.customJoin || `✨💙❖💙✨
🖤 𝙰𝚂𝚂𝙰𝙻𝙰𝙼𝚄𝙰𝙻𝙰𝙸𝙺𝚄𝙼 ✨ {name} ✨
WELCOME TO 💖 {threadName} 💖
❖💛❖
🌸 You are our ✨ {soThanhVien}ᵗʰ ✨ member!
🥰 Hope you enjoy your time here!
💬 Have a great & positive day! ✨
❖💙❖
👤 Added By: {authorName}  
💎━━━━━━━━━━━━━━💎
~ BY: ༊✨MAGIC🔹OF🔸SOUND✨᯾`;

      msg = msg
        .replace(/{name}/g, nameArray.join(', '))
        .replace(/{type}/g, (memLength.length > 1) ? 'Friends' : 'Friend')
        .replace(/{soThanhVien}/g, memLength.join(', '))
        .replace(/{threadName}/g, threadName);

      if (!existsSync(path)) mkdirSync(path, { recursive: true });

      const randomPath = readdirSync(join(__dirname, "cache", "joinvideo", "randomgif"));
      let formPush;
      if (existsSync(pathGif)) {
        formPush = { body: msg, attachment: createReadStream(pathGif), mentions };
      } else if (randomPath.length != 0) {
        const pathRandom = join(__dirname, "cache", "joinvideo", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
        formPush = { body: msg, attachment: createReadStream(pathRandom), mentions };
      } else {
        formPush = { body: msg, mentions };
      }

      return api.sendMessage(formPush, threadID);
    } catch (e) {
      console.log(e);
    }
  }
};
