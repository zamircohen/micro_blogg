const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String, 
    password: String,
    firstname: {type: String},
    lastname: {type: String},
    email: {type: String},
}
    // ,
    // { timestamps: true, toJSON: { virtuals: true } }
);


// userSchema.virtual("posts", {
//     ref: "post",
//     foreignField: "userId",
//     localField: "_id"
//   });


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
exports.User = User;