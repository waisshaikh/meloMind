const express = require('express');
const cookieParser = require('cookie-parser')
const router = require('./Routes/user.auth');
const songRouter = require('./Routes/songs.route')
const cors = require("cors");



const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth",router)
app.use("/api/songs",songRouter)




module.exports=app

