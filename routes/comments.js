var express = require("express");
var router = express.Router({mergeParams:true});
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");

// Comments Routes
router.get("/new",isLoggedIn,function(req, res) {
    // find restaurant by id.
    Restaurant.findById(req.params.id, function(err,restaurant){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{restaurant : restaurant});
        }
    })
});

router.post("/",isLoggedIn, function(req,res){
    // look restaurant using Id
    Restaurant.findById(req.params.id,function(err, restaurant) {
        if(err){
            console.log(err);
            res.redirect("/restaurants");
        }else{
            Comment.create(req.body.comment, function(err,comment){
               if(err){
                   console.log(err);
               } else{
                   //add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comment
                   comment.save();
                   restaurant.comments.push(comment);
                   restaurant.save();
                   res.redirect("/restaurants/"+restaurant._id);
               }
            });
        }
    });
    // create new comment
    // connect new comment to restuarant
    // redirect restaurant show page
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;