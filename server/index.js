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
const app = express();

const userFunctions = require("./controllers/user");

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

app.post("/api/signup", userFunctions.signup);

app.post("/api/login", userFunctions.login);

app.post("/api/forgot", userFunctions.sendResetEmail);
app.post("/api/reset-password", userFunctions.resetPassword);

app.get("/api/user", (req, res) => {
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
