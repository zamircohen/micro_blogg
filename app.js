// Packages
const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const { User } = require("./models/user")
const multer = require("multer")
// const path = require("path")
const bodyParser = require("body-parser")
// const cookierParser = require("cookie-parser")


// Basic variables
const app = express()
const PORT = 3000
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
// app.use(cookierParser())


// Program variables
const POSTS = []
const upload_photo = multer({dest: "user_photo" })


// Routing
app.get("/login", (req, res) => {
    res.render("./login.ejs")
})

app.get("/posts", (req, res) => {
    res.render("./posts.ejs")
})

app.get("/signup", (req, res) => {
    res.render("./signup.ejs")
})

app.get("/update", (req, res) => {
    res.render("./update.ejs", {root: VIEWS_ROOT })
})


// CREATE NEW USER

app.post("/signup", async (req, res) => {
    const {username, password} = req.body;
    const user = new User({username});
    await user.setPassword(password);
    await user.save();
    res.redirect("/login");
  });

// **************************************


// Create & submit a critter post
app.post("/submit", (req, res) => {
    const { post_text } = req.body   
    const today_date = new Date();
    const date = `${today_date.toLocaleDateString()} at ${today_date.toLocaleTimeString()}`
    POSTS.push({ post_text, date })
    console.log(POSTS)
    res.redirect("/posts")
})

// Delete the last post
app.post("/delete", (req, res) => {
    POSTS.pop()
    res.redirect("/")
})




// Upload user photo "function" connected to profile.html
app.use(upload_photo.single("file"))


// app.post("/upload", (_req, res) => {
//     res.redirect("./profile.html", {root: VIEWS_ROOT })
// })



// Connections
mongoose.connect("mongodb://localhost/backend1")
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})