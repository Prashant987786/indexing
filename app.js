const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const app = express();


app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/indexing",{useNewUrlParser: true});
const indexingSchema = {
    category: String,
    brandName: String,
    website: String,
    description: String
}
const Item = mongoose.model("Item", indexingSchema);


app.get("/", function(req, res){
    res.render("indexing");
});

app.get("/home", function(req, res){
    res.render("home");
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact");
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











app.listen(3000, function(){
    console.log("it's  working fine.");
});