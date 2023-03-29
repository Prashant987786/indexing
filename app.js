const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(session({
    secret: "this is indexing project",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://127.0.0.1:27017/indexing",{useNewUrlParser: true});
const indexingSchema = new mongoose.Schema({
    category: String,
    brandName: String,
    website: String,
    description: String
});
const userSchema = new mongoose.Schema({
    username: String,
    email: {type: String, required: true, unique: true},
    password: String
});
userSchema.plugin(passportLocalMongoose);

const Item = mongoose.model("Item", indexingSchema);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function getItems(name){

    const Items = await Item.find({category:name});
    return Items;
      
}

async function getAllItems(){
    const all_items = await Item.find({});
    return all_items;
}

app.get("/", function(req, res){
    if (req.isAuthenticated()){
        res.render("indexing");
    }else{
        res.redirect("/login");
    }
});

app.get("/home", function(req, res){
    // res.render("home", {Item :defaultitems });
    getAllItems().then(function(foundItems){
        res.render("home", {Item: foundItems});
        console.log(foundItems);
    }).catch(function(err){
        console.log(err);
    });
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact");
});

app.get("/login", function(req, res){
    if(req.isAuthenticated()){
        res.redirect("/");
    }else{
        res.render("login");
    }
});
app.post("/login",function(req, res){
    const userID = req.body.username;
    const pass = req.body.password;
    const user = new User({
        username: userID,
        password: pass
    });
    req.login(user, function(err){
        if(!err){
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }else{
            console.log(err);
        }
    });
});

app.post("/register", function(req, res){
    const user = new User({
        username: req.body.username,
        email: req.body.email,
    });

    User.register((user), req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/login");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/")
            });
        }
    });
});



app.post("/", function(req, res){

    const i = new Item({
        category: req.body.category,
        brandName: req.body.brand,
        website: req.body.website,
        description: req.body.description
    });
    i.save();
    res.redirect("/");
});



app.post("/home", function (req, res) {
    const name =req.body.btn;
    console.log(name);
    getItems(name).then(function(foundItems){
        res.render("home", {Item: foundItems});
        console.log(foundItems);
    }).catch(function(err){
        console.log(err);
    });
});




app.listen(3000, function(){
    console.log("it's  working fine.");
});