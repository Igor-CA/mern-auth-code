require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./models/userSchema");
const path = require("path");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("mongoose is conncected");
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.CLIENT_HOST_ORIGIN,
		credentials: true,
	})
);
app.use(
	session({
		secret: process.env.SECRET_KEY,
		resave: true,
		saveUninitialized: true,
	})
);
app.use(cookieParser(process.env.SECRET_KEY));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

app.post("/signup", async (req, res) => {
	console.log(req.body);
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user) {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const newUser = new User({
				username: req.body.username,
				email: req.body.email,
				password: hashedPassword,
			});
			await newUser.save();
			res.send("User created");
		} else {
			res.send("User already exists");
		}
	} catch (err) {
		console.log(console.log(err));
	}
});

app.post("/login", async (req, res, next) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user) {
			res.send("No user exists");
			return;
		}

		const compareResult = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (compareResult) {
			req.logIn(user, (err) => {
				if (err) throw err;
				res.send("Successfully authenticated");
			});
		} else {
			res.send("Incorrect password");
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Internal Server Error");
	}
});

app.post("/send-mail", async (req, res) => {
	console.log(req.body);
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			const tokenLength = 32;
			const token = crypto.randomBytes(tokenLength).toString("hex");
			const timestamp = new Date();
			timestamp.setMinutes(timestamp.getMinutes() + 15);
			const code = `${user._id}/${token}`;

			user.timestamp = timestamp;
			user.token = token;
			user.save();

			console.log("Link: ", `${process.env.CLIENT_HOST_ORIGIN}/reset/${code}`);
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
				  user: process.env.EMAIL,
				  pass: process.env.APP_PASSWORD
				}
			});
			const mailOptions = {
				from:  `Change your email accout<${process.env.EMAIL}>`,
				to: user.email, 
				subject: "Change your password",
				text: `${process.env.CLIENT_HOST_ORIGIN}/reset/${code}`,
				html: `<a href="${process.env.CLIENT_HOST_ORIGIN}/reset/${code}">Click here to change your password</a>`
			};
			  
			transporter.sendMail(mailOptions)
			.then(() => res.send("Email sent"))
			.catch(error => res.send(error));
			
		} else {
			res.send("User Doesn't exists");
		}
	} catch (err) {
		console.log(console.log(err));
	}
});
app.post("/change-password", async (req, res) => {
	console.log(req.body);
	try {
		const currentTimeStamp = new Date();
		const user = await User.findOne({ _id: req.body.userId });
		if (!user) {
			res.send("Error: this user does not exist");
			return;
		}

		if (user.token !== req.body.token) {
			res.send("Error: Invalid token");
			return;
		}

		if (currentTimeStamp < user.timestamp) {
			res.send("Error: Token Expired");
			return;
		}

		const newHashedPassword = await bcrypt.hash(req.body.password, 10);
		user.password = newHashedPassword;
		user.token = null;
		user.save();
		res.send("Password changed successfully");
	} catch (err) {
		console.log(console.log(err));
	}
});

app.get("/user", (req, res) => {
	res.send(req.user);
});


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/build")));

	app.get("*", (req, res) =>
		res.sendFile(
			path.resolve(__dirname, "../", "client", "build", "index.html")
		)
	);
} else {
	app.get("/", (req, res) => res.send("Please set to production"));
}

app.listen(3001, () => {
	console.log("Listen to port 3001");
});
