const mongoose = require ('mongoose');

const blackListSchmea = new mongoose.Schema({
    token:{
        type:String,
        required:[true, "Token is required For Blocklisting"],
    }
},{timestamps:true

}

)

const balckListModel = mongoose.model("Blacklist",blackListSchmea)

module.exports=balckListModel