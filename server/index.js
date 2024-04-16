require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const MongoStore = require("connect-mongo");
const userFunctions = require("./controllers/user");
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
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI,
			collection: "sessions",
			ttl: 15 * 24 * 60 * 60, //15 days
			autoRemove: "native",
		}),
	})
);
app.use(cookieParser(process.env.SECRET_KEY));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

app.use(express.static(path.resolve(__dirname, "public")));

app.post("/api/signup", userFunctions.signup);

app.post("/api/login", userFunctions.login);
app.post("/api/changeProfilePic", userFunctions.changeProfilePicture);
app.get("/api/logout", userFunctions.logout);

app.post("/api/forgot", userFunctions.sendResetEmail);
app.post("/api/reset-password", userFunctions.resetPassword);

app.get("/api/user", (req, res) => {
	res.send(req.user);
});

app.get(
	"/api/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => {
		res.redirect("/");
	}
);

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

app.listen(process.env.PORT, () => {
	console.log(`Listen to port ${process.env.PORT}`);
});
