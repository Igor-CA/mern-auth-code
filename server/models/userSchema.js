const mongoose = require("mongoose");
const user = new mongoose.Schema({
	username: { type: String },
	password: { type: String },
	email: { type: String },
	timestamp: { type: Date },
	token: { type: String },
});

module.exports = mongoose.model("User", user);
