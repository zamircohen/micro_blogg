// Packages
const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const { User } = require("./models/user")
const { Entries } = require("./models/entries")
const multer = require("multer")
const path = require("path")
const bodyParser = require("body-parser")
// const cookierParser = require("cookie-parser")


// Basic variables
const app = express()
const PORT = 3000
const photo = multer({ dest: "user_photo" })
// const VIEWS_ROOT = path.join(__dirname, "views")


// Middlewares
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
    secret: "avsd1234",
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.authenticate("session"));

app.use(bodyParser.urlencoded({extended: true}))

app.use(photo.single("uploaded_file"))

// app.use(cookierParser())


// Program variables
let POSTS = []


// Creating a variable for all the entries
const entry = new Entries()
    // {
    //     post: { type: String, default: "", maxlength: 140},
    // }
    // )


// Routing
app.get("/login", (req, res) => {
    res.render("./login.ejs")
})

app.get("/signup", (req, res) => {
    res.render("./signup.ejs")
})

// app.get("/update", (req, res) => {
//     res.render("./update.ejs")
// })

app.get("/index", (req, res) => {
    if (req.user) {
        res.render("./index.ejs", {username: req.user.username, firstname:req.user.firstname, POSTS});
    } else {
        res.redirect("/login");
    }
})

app.get("/profile", (req, res) => {
    res.render("./profile.ejs", {
        username: req.user.username,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.email,
        })
})



// CREATE NEW USER

app.post("/signup", async (req, res) => {
    const {username, password, firstname, lastname, email} = req.body;
    const user = new User({username, firstname, lastname, email});
    await user.setPassword(password);
    await user.save();
    res.redirect("/login");
  });

// **************************************

// The main page

app.post("/login", passport.authenticate("local", {
    successRedirect: "/index"
}))



// Logout function
app.post("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
})



// Create & submit a critter post
app.post("/index", async (req, res) => {
    const { post_text } = req.body   
    const today_date = new Date();
    const date = `${today_date.toLocaleDateString()} at ${today_date.toLocaleTimeString()}`
    POSTS.push({ post_text, date })

    // const entry = new Entries({post_text, date})
    // await entry.save()

    console.log(entry)

    res.redirect("/index")
})



// Delete the last post
app.post("/delete", (req, res) => {
    POSTS.pop()
    res.redirect("/index")
})


// Edit user information
app.post("/edit_user", async (req, res) => {

    var query = {"username": req.user.username}
    const {firstname, lastname, email} = req.body;

    console.log(firstname, lastname, email)

    // User.update(query, {$set: {firstname : firstname, lastname: lastname, email: email}} );
    // User.save();
  
    User.findOneAndUpdate(query, {$set: {firstname : firstname, lastname: lastname, email: email}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.redirect("/profile")
    })

})


// Upload user photo "function" connected to profile.html
app.post("/upload", (req, res) => {
    res.redirect("/profile")
})



// Connections
mongoose.connect("mongodb://localhost/backend1")
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})