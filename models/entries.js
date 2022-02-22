const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const entriesSchema = new mongoose.Schema({});
entriesSchema.plugin(passportLocalMongoose);

const Entries = mongoose.model("Entries", entriesSchema);

exports.Entries = Entries;