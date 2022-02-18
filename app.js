const bodyParser = require("body-parser")
const express = require("express")
const multer = require("multer")
const path = require("path")

const app = express()
const PORT = 3000
const STATIC_ROOT = path.join(__dirname, "static")


app.get("/", (req, res) => {
    res.sendFile("./index.html", { root: STATIC_ROOT })
})



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})