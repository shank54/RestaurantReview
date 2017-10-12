var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Restaurant =  require("./models/restaurant"),
    Comment    = require("./models/comment"),
    methodOverride = require("method-override");
var User     = require("./models/user");
    

var commentRoutes = require("./routes/comments"),
    restaurantRoutes = require("./routes/restaurants"),
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost/restaurant_db");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Passport Config
app.use(require("express-session")({
    secret: "Some Secret Text here",
    resave: false,
    saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/",indexRoutes);
app.use("/restaurants/:id/comments",commentRoutes);
app.use("/restaurants",restaurantRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Restaurant Server has Started");
});