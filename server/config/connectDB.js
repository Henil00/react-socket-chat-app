const mongoose = require('mongoose')

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        const connection = mongoose.connection
        connection.on("connected",()=>{
            console.log("Connect To DB");
        })
        connection.on("error",(error)=>{
            console.log("Somthing went wrond in mongo db ", error);
        })
    }catch(err){
        console.log("Somthing went worng ", err);
    }
}

module.exports = connectDB