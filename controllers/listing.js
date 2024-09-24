const Listing = require("../models/listing");


module.exports.index = async (req, res, next) => {
    let alllisting = await Listing.find({});
    res.render("./listing/index.ejs", { alllisting });
}


module.exports.new = async (req, res, next) => {
    res.render("./listing/new.ejs", {});
}


module.exports.show = async (req, res, next) => {
    let { id } = req.params;
    // const listing= await Listing.findById(id);

    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author"
        },
    }).populate("owner")
    if (!listing) {
        req.flash("error", "listing you requested has been deleted")
        res.redirect("/listings")
    }


    res.render("./listing/show.ejs", { listing })
}


module.exports.create = async (req, res, next) => {

    let url = req.file.path
    let filename = req.file.filename
    //  console.log(url," .. ",filename)
    let newlisting = new Listing(req.body.listing);   //yaha expreess urlencoded wali error aai thi
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "New listing Created")
    res.redirect("/listings")


}



module.exports.edit = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "listing you requested has been deleted")
        res.redirect("/listings")
    }
    let originalimage = listing.image.url;
  
    originalimage=originalimage.replace("/upload","/upload/h_220,w_300/e_blur:150")
   
    res.render("./listing/edit.ejs", { listing, originalimage });
}



module.exports.update = async (req, res, next) => {

    let id = req.params.id;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })  //yaha expreess urlencoded wali error aai thi

    if (typeof req.file !== "undefined") {
        let url = req.file.path
        let filename = req.file.filename
        listing.image = { url, filename };
            await listing.save();
    }


    req.flash("success", `Listing updated `)
    res.redirect(`/listings/${id}`)
}


module.exports.delete = async (req, res, next) => {
    let id = req.params.id;
    let a = await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted")
    res.redirect('/listings');
}