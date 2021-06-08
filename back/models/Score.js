const mongoose = require("mongoose")

const ScoreSchema = new mongoose.Schema({
    Result : {type:String, required:true},
    Feedback : {type:String},
    Code : {type:String},
    RefProblem : {type:mongoose.Schema.Types.ObjectId,ref:"Problem", required:true},
    RefUser : {type:mongoose.Schema.Types.ObjectId,ref:"User", required:true}
})

module.exports = mongoose.model("Score",ScoreSchema)