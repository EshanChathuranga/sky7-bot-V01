const {  MessageType, MessageOptions, Mimetype } = require('@whiskeysockets/baileys');
require("./config");
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL, listAll, getMetadata  } = require('firebase/storage');
const fs = require('fs-extra')


module.exports = botWa =  async (botWa, chatUpdate, store) => {
    try{
    var body = chatUpdate.messages[0].message.conversation;
    const prefix = global.prefix;
    const isCmd = body.startsWith(prefix);
    const notCmd = body.startsWith('')
    const command = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : ''
    const args = body.trim().split(/ +/).slice(1)
    const fromId = chatUpdate.messages[0].key.remoteJid;
    const fromMe = chatUpdate.messages[0].key.fromMe;
    const quotedmsg = chatUpdate.messages[0];
    const pushName = chatUpdate.messages[0].pushName;
    const firebaseconfig = global.firebaseConfig;

   switch (command) {
         
    case 'alive':
    // https://i.ibb.co/LrdvmZX/sky7-bot-logo03.png
    // https://i.ibb.co/n1HxqQ8/sky7-bot-logo02.jpg
    // https://i.ibb.co/N9H1jqT/ruki-main.jpg
    
    const aliveMsg = "\n \n```Hellow I'm online now!```\n \n```You can get mathematics papers using < .papers > command.```\n \n```Devoloper - *Eshan Chathuranga*```\n"
    botWa.sendMessage(fromId, {image:{url:'https://i.ibb.co/LrdvmZX/sky7-bot-logo03.png'}, caption:aliveMsg},  {quoted:quotedmsg} )
    break;

   case 'papers':

      fs.readJson('./firebase_data/funtion_names.json').then(object => {
        let fileType = ``
        fileData = ``
         object.forEach(fileEle => {
          fs.readJson('./firebase_data/file_names.json').then(packageObj => {
            
               packageObj.forEach(element => {
                if (element.file_type === fileEle){
                  fileData +=  packageObj.indexOf(element)+ '  ---  ' + element.file_name + '\n' + '\n' 
                }
               });
              //  console.log(fileData)
              botWa.sendMessage(fromId, {text:fileData}, {quoted:quotedmsg})
  
          })
  
        })
       
      })
break;


           case 'get':
            const app = initializeApp(firebaseconfig);
            const storage = getStorage(app);
             fs.readJson('./firebase_data/file_names.json').then(obj => {
               getDownloadURL(ref(storage, obj[args].file_path))
  .then((url) => {
   let SendFileName = obj[args].file_name
   botWa.sendMessage(fromId, {text:'```Uploading Document.........!```'}, {quoted:quotedmsg})
   botWa.sendMessage(fromId, {
      document:{url: url},
      caption: SendFileName,
      fileName: SendFileName
   }, {quoted:quotedmsg})
  })
  .catch((error) => {
    botWa.sendMessage(fromId, {text:error}, {quoted:quotedmsg})
  });
             })


break;



   }

    }catch(err){
        console.log(err)
    }
}