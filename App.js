if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}




const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path")
const Listing = require("./models/listing.js");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
// const wrapasync=require("./utils/wrapAsync.js")
const ExpressError = require("./utils/expresserror.js")
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const LocalStrategymongoose = require("passport-local-mongoose");
const User = require("./models/user.js")



mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
// const dburl = process.env.ATLASDB_URL
// async function main() {
//     await mongoose.connect(dburl)
// }
// mongoose.connect(dburl);

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))



// const store = MongoStore.create({
//     mongoUrl: dburl,
//     crypto: {
//         secret: process.env.SECRET,
//     },
//     touchAfter:  24 * 3600,
// });

// store.on("error",(err)=>{
//     console.log("Error in Mongo Session Store",err)
// })

const sessionOptions = {
    // store:store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}



app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.Curruser = req.user;
    next();
})


// app.get("/demouser",async(req,res)=>{
//       let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//       });

//     let regitereduser=await User.register(fakeuser,"helloworld");
//     res.send(regitereduser);
// })




app.use("/listings", listingsRouter)

app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", userRouter);



app.use('*', (req, res, next) => {
    next(new ExpressError(404, "page not found"))     //har invalid page ki request ki liye ye error aygi (jo exist nhi karta page)
})

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Something went wrong" } = err;  //page , kahi bhi error aagi wahah se nexgt hoge or yaha aake error hadle hogi by error handling middleware
    res.status(statuscode).render('Error.ejs', { message })
})


app.listen(8000, () => {
    console.log(`server is listning to port 8000`);

})