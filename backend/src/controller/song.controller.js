const songModel = require ('../Modules/song.model');
const storageService = require("../services/storage.servise")
const id3 = require('node-id3')

async function uploadSongs (req,res){
    const songBuffer = req.file.buffer
   const tags = id3.read(songBuffer);

   const songFile = await storageService.uploadFile({
    buffer: songBuffer,
    filename:tags.title+".mp3",
    folder:"/cohort2/moodify/songs",
   })
   const posterFile = await storageService.uploadFile({
    buffer:tags.image.imageBuffer,
    filename:tags.title+".jpeg",
    folder:"/cohort2/moodify/posters",
   })

   const song = await songModel
    
    console.log(tags);
    

}

module.exports={uploadSongs}