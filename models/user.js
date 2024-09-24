const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose")

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})


userSchema.plugin(passportLocalMongoose)

module.exports=mongoose.model("User",userSchema);  // yaha jo naam doge collection ka wahi naam listing.js m owner ke ref m doge