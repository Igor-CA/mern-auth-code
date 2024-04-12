const User = require("./models/userSchema");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.OAUTH_CLIENT_ID,
				clientSecret: process.env.OAUTH_KEY,
				callbackURL: "http://localhost:3001/auth/google/callback", // Your callback URL
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					console.log(profile)
					const user = await User.findOne({
						email: profile._json.email,
					});
					
					if (!user) {
						const newUser = new User({
							email: profile._json.email,
							username: profile._json.name,
						});
						await newUser.save();
						return done(null, newUser);
					}


					return done(null, user);
				} catch (err) {
					return done(err);
				}
			}
		)
	);

	passport.use(
		new localStrategy(async (username, password, done) => {
			try {
				const user = await User.findOne({ username: username });
				if (!user) return done(null, false);

				bcrypt.compare(password, user.password, (err, res) => {
					if (res) {
						return done(null, user);
					} else {
						return done(null, false, {
							message: "Incorrect password",
						});
					}
				});
			} catch (err) {
				console.log(err);
			}
		})
	);

	passport.serializeUser(function (user, done) {
		console.log("Serialize");
		done(null, user.id);
	});

	passport.deserializeUser(async function (id, done) {
		console.log("Deserialize");
		try {
			const user = await User.findById(id);
			const userInfo = {
				username: user.username,
				_id:user._id
			};
			done(null, userInfo);
		} catch (err) {
			done(err);
		}
	});
};
