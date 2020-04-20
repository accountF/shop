const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../models/users");
const passport = require("passport");

const router = express.Router();

router.post("/signin", passport.authenticate("local"), (req, res) => {
	res.send(req.user);
});

router.post("/signup", async (req, res) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	Users.findOne({email: req.body.email}).then((user) => {
		console.log(user);
		if (!user) {
			Users.create({
				email: req.body.email,
				name: req.body.name,
				password: hashedPassword
			}).then((user) => {
				console.log(user);
				res.send(user.name);
			});
		}
		else {
			res.send();
		}
	});
});

router.get("/logout", (req, res) => {
	req.logout();
	res.send();
});

router.get("/", (req, res) => {
	res.send(req.user);
});

module.exports = router;
