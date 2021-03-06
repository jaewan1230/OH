//1 depth
const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    Title : {type:String, required:true},
    Body :{type:String, required:true},
    RefPost : {type:mongoose.Schema.Types.ObjectId, ref:"Post", required:true},
    ToComment : {type:mongoose.Schema.Types.ObjectId, ref:"Comment"},
    Date : {type: Date},
    Writer : {type:mongoose.Types.ObjectId, ref:"User", required:true},
    Nickname : String
})

module.exports = mongoose.model("Comment",CommentSchema)