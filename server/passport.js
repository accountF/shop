const LocalStrategy = require("passport-local").Strategy;
const Users = require("./models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function initialize(passport) {
	passport.use(new LocalStrategy({
			usernameField: "email",
			passwordField: "password"
		},
		(email, password, done) => {
			Users.findOne({email}, (err, user) => {
				if (!user) {
					return done(null, false, {message: "No user with that email"});
				}
				bcrypt.compare(password, user.password, (err, result) => {
					if (err) {
						console.log(err);
					}
					if (result) {
						const token = jwt.sign(user._id.toString(), "ne vsem");
						let userInfo = {
							id: user._id,
							email: user.email,
							token
						};
						return done(null, userInfo);
					}
					return done(null, false, {message: "Invalid"});
				});
			});
		}));


	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		Users.findById({_id: id}, (err, user) => {
			if (err) {
				return done(err);
			}
			return done(null, user);
		});
	});
}

module.exports = initialize;
