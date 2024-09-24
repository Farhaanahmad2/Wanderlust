const express=require("express");
const router=express.Router( {mergeParams : true});
const wrapasync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/expresserror.js")
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
// const {listingSchema}  =require("../schema.js");
const {reviewSchema}  =require("../schema.js");

const {validatereview,isLoggedIn,isReviewAuthor}=require("../middleware.js")








//review post form
router.post('/',isLoggedIn,validatereview, wrapasync(async(req,res)=>{
   
    const listing=await Listing.findById(req.params.id);
    const newreview=new Review(req.body.review);
    newreview.author=req.user._id;
   
    listing.reviews.push(newreview);
   await newreview.save();
   await listing.save();
   req.flash("success","New review created")
    res.redirect(`/listings/${listing._id}`);
}))

//review delete rote
router.delete("/:reviewId",isReviewAuthor, wrapasync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull :{reviews:reviewId}});
    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`)

}))

module.exports=router;