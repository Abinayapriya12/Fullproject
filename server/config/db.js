const mongoose =require("mongoose")

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo Db connected")
    }
    catch(err){
        console.error(err);
    }
}
module.exports=connectDb