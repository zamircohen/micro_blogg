const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({});

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     firstname: String,
//     lastname: String,
//     email: String
// });


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

exports.User = User;