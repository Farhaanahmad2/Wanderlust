const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const {listingSchema,reviewSchema}  =require("./schema.js");
const ExpressError=require("./utils/expresserror.js");


module.exports.isLoggedIn=(req,res,next)=>{
 
    if(!req.isAuthenticated())
        {      req.session.redirectUrl=req.originalUrl;
               req.flash("error","You are not logged in");
              return  res.redirect("/login")
        }
        next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl)
    {
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.isowner=async(req,res,next)=>{
    let id=req.params.id;
    let listing= await Listing.findById(id);
    if(! listing.owner._id.equals(res.locals.Curruser._id))
    {
     req.flash("error","You are not the owner of this listing");
       return  res.redirect(`/listings/${id}`)
    }
    next();
}


module.exports.validatelisting=async(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
        // throw new ExpressError(400,error);
    }
    else
    {
        next();
    }
}

module.exports.validatereview=async(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {  
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
        // throw new ExpressError(400,error);
    }
    else
    {
        next();
    }
}


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(! review.author._id.equals(res.locals.Curruser._id))
    {
     req.flash("error","You are not the author of this review");
       return  res.redirect(`/listings/${id}`)
    }
    next();
}