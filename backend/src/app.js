const express = require('express');
const cookieParser = require('cookie-parser')
const router = require('./Routes/user.auth')


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",router)




module.exports=app

