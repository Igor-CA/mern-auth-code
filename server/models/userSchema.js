const mongoose = require("mongoose");
const user = new mongoose.Schema({
	username: { type: String },
	password: { type: String },
	email: { type: String },
	tokenTimestamp: { type: Date },
	token: { type: String },
	profileImageUrl:  { type: String },
});

module.exports = mongoose.model("User", user);
