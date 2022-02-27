const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const entriesSchema = new mongoose.Schema(
    {
        entry: String, 
        entryBy: String,
        entryDate: {type: Date, default: Date.now}
});


entriesSchema.plugin(passportLocalMongoose);

const Entries = mongoose.model("Entries", entriesSchema);
exports.Entries = Entries;