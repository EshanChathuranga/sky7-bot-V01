const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL, listAll, getMetadata  } = require('firebase/storage');
const fs = require('fs-extra')

exports.firebaseSrorage = (firebaseConf) => {
    const app = initializeApp(firebaseConf);
    const storage = getStorage(app);
//Array to save items
let itemsArray = []
let fileArray = []
 letlistItems = ``
    const listFolderRef = ref(storage, 'papers');
    listAll(listFolderRef).then((res) => {
        res.prefixes.forEach((foldersRef) => {
            let filePath = foldersRef._location.path_;
            let splitArrayFiles = filePath.split('/')
            fileArray.push(splitArrayFiles[1])
        //get items path
          let itemsPathRef = ref(storage, `papers/${splitArrayFiles[1]}`);
          listAll(itemsPathRef).then((res) => {
            res.items.forEach((itemList) => {
              let itempath = itemList._location.path_;
              let splitArrayItems = itempath.split('/')
            itemsArray.push({
                       file_type: splitArrayFiles[1],
                       file_name: splitArrayItems[2],
                       file_path: itempath
            })
            writeData(itemsArray);
            writeData1(fileArray);
            })

          })
        })
    })

}

function writeData(dataRef) {
    fs.writeJson('./firebase_data/file_names.json', dataRef , err => {
      if (err) return console.error(err)
    })
  }

  function writeData1(dataRef) {
    fs.writeJson('./firebase_data/funtion_names.json', dataRef , err => {
      if (err) return console.error(err)
    })
  }