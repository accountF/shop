const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const UsersScheme = new Scheme({
	name: String,
	email: String,
	password: String
}, {versionKey: false});

const Users = mongoose.model("users", UsersScheme);

module.exports = Users;
