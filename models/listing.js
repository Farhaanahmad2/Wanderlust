const mongoose=require("mongoose");
const Review=require("./review.js")
const User=require("./user.js")

const listingschema=new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    description:String,
    image:{
            url:String,
            filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"         // ye ref m naam same as collection wala hoga
         },
    
})


listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length)
    {
        let res = await Review.deleteMany({ _id: { $in : listing.reviews}})
        console.log(res);
    }
})

module.exports=mongoose.model("Listing",listingschema);