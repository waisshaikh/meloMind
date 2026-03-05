const mongoose = require ('mongoose')

const  UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"Username Must be Unique"]
    },
    email:{
        type:String,
        unique:[true,"Email must eb unique"]
    },
    password:{
        type:String,
        Select:false
    }


});


const userModel = mongoose.model('User',UserSchema);

module.exports=userModel
