const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new mongoose.Schema({});

const userSchema = new mongoose.Schema({
    username: String, 
    password: String,
    firstname: {type: String, default: ""},
    lastname: {type: String, default: ""},
    email: {type: String, default: ""},
});


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

exports.User = User;