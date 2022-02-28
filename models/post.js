const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        entry: String,
        entryDate: Date,
        entryUser: String,
        entryDateString: String
    })


const Post = mongoose.model("Post", postSchema);
exports.Post = Post;