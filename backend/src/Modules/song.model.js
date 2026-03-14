const mongoose = require ("mongoose")


const songSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    posterurl:{
        type:String,
        required:true
    },
    tittle:{
        type:String,
        required:true
    }


})

const songModel =  mongoose.model("Song",songSchema);

module.exports=songModel