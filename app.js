const bodyParser = require("body-parser")
const express = require("express")
const multer = require("multer")
const path = require("path")

const app = express()
const PORT = 3000
const STATIC_ROOT = path.join(__dirname, "static")

const upload_photo = multer({dest: "user_photo" })

app.get("/", (req, res) => {
    res.sendFile("./index.html", { root: STATIC_ROOT })
})

app.get("/create", (req, res) => {
    res.sendFile("./create.html", { root: STATIC_ROOT })
})

app.get("/update", (req, res) => {
    res.sendFile("./update.html", {root: STATIC_ROOT })
})


// Upload user photo "function" connected to profile.html
app.use(upload_photo.single("file"))


// app.post("/upload", (_req, res) => {
//     res.redirect("./profile.html", {root: STATIC_ROOT })
// })




app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})