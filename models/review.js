const mongoose=require("mongoose");
const User=require("./user.js");

const reviewschema=new mongoose.Schema(
    {
           comment:String,
           rating:{
            type:Number,
            max:5,
            min:1
           },
           createAt:{
                 type:Date,
                 default:Date.now()
           },
           author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
           }
    }
)

module.exports=mongoose.model("Review",reviewschema)