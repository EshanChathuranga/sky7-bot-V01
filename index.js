const {default: makeWASocket, makeInMemoryStore,   useMultiFileAuthState,
    DisconnectReason,} = require("@whiskeysockets/baileys");

const {Boom} = require('@hapi/boom');
const pino = require("pino");
require("./config")
const {firebaseSrorage} = require("./lib/myFunction.js")

const store = makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" }),
  });




  async function connectToWhatsapp() {
    const firebaseconfig = global.firebaseConfig;
    firebaseSrorage(firebaseconfig);
        
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const botWa = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: true,
        browser: ["SKY7 BOT", "Safari", "3.O"],
        auth: state,
    })
    store.bind(botWa.ev);

    //Message updates
    botWa.ev.on("messages.upsert", async (chatUpdate) => {

      try {
        m = chatUpdate.messages[0];
        if(!m.message) return;
        if (m.key && m.key.remoteJid === "status@broadcast") return;
        if (m.key.id.startsWith("BAE5") && m.key.id.length === 16) return;

       require("./main")(botWa, chatUpdate, store);


      } catch(err) {
        console.log(err);
      }
      
    })


    // botWa.ev.on("presence.update", (eventUpdate) => {
    //   console.log(eventUpdate)
    //   botWa.sendMessage(global.userId, {text:`${eventUpdate.id}`})
    // })


    //Connection Brandwidth Updates
    botWa.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
          let reason = lastDisconnect.error
            ? lastDisconnect?.error?.output.statusCode
            : 0;
          if (reason === DisconnectReason.badSession) {
            console.log(`Bad Session File, Please Delete Session and Scan Again`);
            process.exit();
          } else if (reason === DisconnectReason.connectionClosed) {
            console.log("Connection closed, reconnecting....");
            connectToWhatsapp();
          } else if (reason === DisconnectReason.connectionLost) {
            console.log("Connection Lost from Server, reconnecting...");
            connectToWhatsapp();
          } else if (reason === DisconnectReason.connectionReplaced) {
            console.log(
              "Connection Replaced, Another New Session Opened, Please Close Current Session First"
            );
            process.exit();
          } else if (reason === DisconnectReason.loggedOut) {
            console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
            process.exit();
          } else if (reason === DisconnectReason.restartRequired) {
            console.log("Restart Required, Restarting...");
            connectToWhatsapp();
          } else if (reason === DisconnectReason.timedOut) {
            console.log("Connection TimedOut, Reconnecting...");
            connectToWhatsapp();
          } else {
            console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
          }
        }
        console.log('Connected...', update)
      });
    
     botWa.ev.on("creds.update", saveCreds);




  }
  connectToWhatsapp();
