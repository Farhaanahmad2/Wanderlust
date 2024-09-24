const express=require("express");
const router=express.Router();
const User=require("../models/user.js")
const wrapasync=require("../utils/wrapAsync.js")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const { saveRedirectUrl }=require("../middleware.js")


router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs")
})

router.post("/signup",wrapasync(async(req,res)=>{
    try{
       let {username,email,password}= req.body;
         const newUser=new User({email,username})
         let registereduser=await User.register(newUser,password);
         req.login(registereduser,(err)=>{
               if(err)
               {
                return next(err);
               }

               req.flash("success","Welcome to wanderlust !")
               res.redirect("/listings");
         })
    }catch(err){
        req.flash("error",err.message)
        res.redirect("/signup");
    }
}))

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs")
})


router.post("/login",saveRedirectUrl, passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}), async(req,res)=>{
         req.flash("success","Welcom back to wanderlust");
         let redirecturl=res.locals.redirectUrl || "\listings";
         res.redirect(redirecturl)
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
          return next(err);
        }
        req.flash("success","You are logged out")
        res.redirect("/listings")
    })
})

module.exports=router;