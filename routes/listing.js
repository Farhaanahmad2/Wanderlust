const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/expresserror.js")
const {listingSchema}  =require("../schema.js");
// const {reviewSchema}  =require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isowner, validatelisting}=require("../middleware.js")
const multer=require("multer");
const {storage}=require("../cloudconfig.js")
const upload=multer( {storage});



const listingcontroller=require("../controllers/listing.js")



//index rpoute
router.get("/",wrapasync(listingcontroller.index))

// new route
router.get('/new',isLoggedIn, wrapasync(listingcontroller.new));


//show route
router.get("/:id",wrapasync(listingcontroller.show))



//create route
router.post("/",isLoggedIn,upload.single('listing[image]'),validatelisting, wrapasync(listingcontroller.create));

``


 //edit route
router.get("/:id/edit", wrapasync(listingcontroller.edit));


//update route
router.put("/:id",isLoggedIn,isowner, upload.single('listing[image]'),validatelisting,wrapasync(listingcontroller.update))


//delete route
router.delete("/:id",isLoggedIn,isowner,wrapasync(listingcontroller.delete));

module.exports=router;
