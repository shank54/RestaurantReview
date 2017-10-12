var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
    res.render("landing");
});

// Auth routes
// show reister form
router.get("/register",function(req, res) {
    res.render("register");
});

// Signup logic
router.post("/register",function(req, res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/restaurants");   
        })
    });
});

// show login form
router.get("/login",function(req, res) {
    res.render("login");
});

// handle login 
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/restaurants",
        failureRedirect: "/login"        
    }),function(req, res) {
    res.send("login happens here");
});

//logout route
router.get("/logout",function(req, res) {
   req.logout();
   res.redirect("/restaurants");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;