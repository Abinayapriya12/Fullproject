const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title:String,
    author:String,
    category:String,
    publishedyear:Number
})

module.exports =mongoose.model("book",bookSchema)