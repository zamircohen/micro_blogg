// Packages
const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const { User } = require("./models/user")
const { Post } = require("./models/post")
const path = require("path")
const bodyParser = require("body-parser")
const multer = require("multer")

// const cookieParser = require("cookie-parser")


// Basic variables
const app = express()
const PORT = 3000


// UPLOAD PHOTO FUNCTION 

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/user_photo/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  
const upload = multer({ storage: storage });

// const upload = multer({ dest: "user_photo" })





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



// app.use(express.static(__dirname + "/user_photo"))
app.use(express.static("public"))
app.use(express.static("files"))
app.use(express.static("public/user_photo"))
app.use(upload.single("file"))




//OUR OWN MIDDLEWARE - IS A USER LOGGED IN?
const requireLogin = (req, res, next) => {  // Vi skapar en egen middleware "requireLogin" - Om req.user = true så går man till nästa steg, annars skciakr vi fel meddelande
    if (req.user) {
        next()
    } else {
        res.sendStatus(401)
    }
}

  

// app.use(cookierParser())



// Routing
app.get("/", (req, res) => {
    res.render("./login.ejs")
})

app.get("/login", (req, res) => {
    res.render("./login.ejs")
})

app.get("/signup", (req, res) => {
    res.render("./signup.ejs")
})

app.get("/index", requireLogin, async (req, res) => {
    
    var mysort = { entryDate: -1 };
    const entries = await Post.find().sort(mysort)

    if (req.user) {
        res.render("./index.ejs", {
            username: req.user.username, 
            firstname:req.user.firstname, 
            entries
            });
    } else {
        res.redirect("/login");
    }
})

app.get("/profile", requireLogin, async (req, res) => {

    var mysort = { entryDate: -1 };
    const entries = await Post.find().sort(mysort)

    res.render("./profile.ejs", {
        username: req.user.username,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        entryPhoto: req.user.profilePicture,
        entries
        })
})

app.get("/critter/:id", (req, res) => {
    const id = parseInt(req.params.id)
    
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
app.post("/entries", async (req, res) => {

    const entryUser = req.user.username
    const { entry } = req.body   
    const entryDate = new Date();
    const entryDateString = `${entryDate.toLocaleDateString()} at ${entryDate.toLocaleTimeString()}`
    const entryPhoto = req.user.profilePicture

    const newEntry = new Post({ entry, entryDate, entryUser, entryDateString, entryPhoto })
    await newEntry.save()
    res.redirect("/index")
})



// Edit user information
app.post("/edit_user", async (req, res) => {

    var query = {"username": req.user.username}
    const {firstname, lastname, email} = req.body;

    console.log(firstname, lastname, email)
 
    User.findOneAndUpdate(query, {$set: {firstname : firstname, lastname: lastname, email: email}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.redirect("/profile")
    })

})


// Upload user photo "function" connected to profile.html
app.post("/upload", async (req, res) => {
    
    const user = req.user

    user.profilePicture = req.file.filename
    await user.save()

    res.redirect("/profile")
})



// Connections
mongoose.connect("mongodb://localhost/micro_blogg").then(console.log("mongodb connected"))

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})