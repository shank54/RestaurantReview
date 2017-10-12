var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");

router.get("/",function(req,res){
   //Get all restaurants from db.
   Restaurant.find({},function(err,allRestaurants){
       if(err){
           console.log(err);
       }else{
           res.render("restaurants/index",{restaurants : allRestaurants});
       }
   })
});

//create new restaurant
router.post("/",isLoggedIn,function(req,res){
    // get data from form and add to the restaurants array.
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRestaurant = {name : name , image : image, description : description, author: author}
    //Create new restaurant and save to db.
    Restaurant.create(newRestaurant,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect to the restaurants page.
            res.redirect("/restaurants"); 
        }
    })
});

// NEW -- show form to create new restaurant
router.get("/new",isLoggedIn,function(req, res) {
    res.render("restaurants/new");
});

// shows more info about a restaurant
router.get("/:id",function(req,res){
    // Find the restaurant with provided id.
    Restaurant.findById(req.params.id).populate("comments").exec(function(err,foundRestaurant){
        if(err){
            console.log(err);
        }else{
            console.log(foundRestaurant);
            // render show template with that restaurant.
            res.render("restaurants/show",{restaurant : foundRestaurant});
        }
    })
});

// Edit restaurants
router.get("/:id/edit", checkRestaurantOwnership, function(req, res) {
    Restaurant.findById(req.params.id, function(err,foundRestaurant){
            res.redirect("/restaurants");
    });
});

// update restaurants
router.put("/:id",checkRestaurantOwnership,function(req,res){
   // find and update the restaurant.
   Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
       if(err){
           res.reditect("/restaurants");
       }else{
           res.redirect("/restaurants/" + req.params.id);
       }
   });
});

// destroy restaurant
router.delete("/:id",checkRestaurantOwnership,  function(req,res){
    Restaurant.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/restaurants");
        }else{
            res.redirect("/restaurants");
        }
    });
});



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkRestaurantOwnership(req,res,next){
    if(req.isAuthenticated()){
        Restaurant.findById(req.params.id, function(err,foundRestaurant){
        if(err){
            res.redirect("/restaurants");
        }else{
            if(foundRestaurant.author.id.equals(req.user._id)){
                next();
            }else{
                res.redirect("back");
            }
            
        }
    });
    }else{
            res.redirect("back");
    }
}

module.exports = router;