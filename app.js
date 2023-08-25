//jshint esversion:6
require('dotenv').config()


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encryption_tool = require("mongoose-encryption");

const app = express();

const database = "userDB";
mongoose.connect("mongodb://localhost:27017" + "/" + database);
//using body-parser
app.use(bodyParser.urlencoded(
    {extended: true}
))

const userSchmea = new mongoose.Schema({
    username: String,
    password: String
})

userSchmea.plugin(
    //which plugin
    encryption_tool, 

    //secret key
    {secret: process.env.SECRET, 

    //which filed to be encrypted
    encryptedFields: ["password"]},

)
const User = mongoose.model("User", userSchmea);

//using ejs as view engine
app.set("view engine", 'ejs');

//tell express where to find ejs templates
app.set("views", __dirname + "/views")

// ****************************hanlding requests****************************
app.get("/", (req, res) => {
    res.render("home");
})

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })

    .post((req, res) => {
        const newUser = new User(req.body)
        newUser.save();
        res.redirect("/login")
    })

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })

    .post((req, res) => {
        User.findOne({username: req.body.username})
            .then(result => {
                if(result == null) {
                    res.redirect("/login");
                } else {
                    if (result.password == req.body.password) {
                        res.render("secrets");
                    } else {
                        res.redirect("login");
                    }
                    
                }
            })
            .catch(err => {
                console.log(err);
                res.send("Error")
            })
    })


app.listen(3000, () => {
    console.log("Dude I am server and I am active on port 3000.")
})