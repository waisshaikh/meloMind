require ('dotenv').config()
const app = require ('./src/app');
const connectToDb = require('./src/config/ConnectDb')




connectToDb();
app.listen(3000,()=>{
    console.log("server is running on port number 30000");
    
});