const express = require("express")
const multer = require("multer")
const path = require("path")
const bodyParser = require("body-parser")

const app = express()
const PORT = 3000
const VIEWS_ROOT = path.join(__dirname, "views")

app.use(bodyParser.urlencoded({extended: true}))

const POSTS = []

const upload_photo = multer({dest: "user_photo" })


app.get("/", (req, res) => {
    res.render("./index.ejs", {root: VIEWS_ROOT})
})

app.get("/posts", (req, res) => {
    res.render("./posts.ejs", { post_items: POSTS })
})


app.get("/create", (req, res) => {
    res.render("./create.ejs", { root: VIEWS_ROOT })
})


app.get("/update", (req, res) => {
    res.render("./update.ejs", {root: VIEWS_ROOT })
})


app.post("/submit", (req, res) => {
    const { item } = req.body   
    POSTS.push(item)
    res.redirect("/posts")
})




// Upload user photo "function" connected to profile.html
app.use(upload_photo.single("file"))


// app.post("/upload", (_req, res) => {
//     res.redirect("./profile.html", {root: VIEWS_ROOT })
// })




app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})