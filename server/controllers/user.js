const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { body, validationResult } = require("express-validator");

exports.signup = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("É obrigatório informar um nome de usuário")
		.matches(/^[A-Za-z0-9]{3,16}$/)
		.withMessage(
			"O nome de usuário não pode ter caracteres especiais (!@#$%^&*) e deve ter entre 3 e 16 caracteres."
		)
		.escape(),
	body("password")
		.trim()
		.notEmpty()
		.withMessage("A senha é obrigatória")
		.matches(
			/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
		)
		.withMessage(
			"A senha deve conter pelo menos uma letra, número e caractere especial(!@#$%^&*)"
		)
		.isLength({ min: 8 })
		.withMessage("A senha precisa de pelo menos 8 caracteres")
		.escape(),
	body("confirm-password")
		.trim()
		.notEmpty()
		.withMessage("O campo de confirmar senha é obrigatório")
		.matches(
			/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
		)
		.withMessage(
			"A senha deve conter pelo menos uma letra, número e caractere especial(!@#$%^&*)"
		)
		.isLength({ min: 8 })
		.withMessage("A senha precisa de pelo menos 8 caracteres")
		.escape(),
	body("email")
		.trim()
		.notEmpty()
		.withMessage("É obrigatório informar um email")
		.isEmail()
		.withMessage("O email inserido não é um email válido.")
		.escape(),

	asyncHandler(async (req, res, next) => {
		if (req.headers.authorization !== process.env.API_KEY) {
			res.status(401).json({ msg: "Not authorized" });
			return;
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			username,
			password,
			email,
			["confirm-password"]: confirmPassword,
			["tos-checkbox"]: tosCheckbox,
		} = req.body;

		if (password !== confirmPassword) {
			return res.status(409).json({ message: "As senhas devem coincidir" });
		}
		if (!tosCheckbox) {
			return res
				.status(409)
				.json({ message: "Concorde com nossos termos para criar uma conta" });
		}

		const [existingUser] = await User.find()
			.or([{ username }, { email }])
			.limit(1);

		if (existingUser) {
			return res
				.status(409)
				.json({ message: "Email ou usuário ja estão sendo usados" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			username,
			password: hashedPassword,
			email,
		});
		await newUser.save();
		res.status(201).json({ message: "User created successfully" });
	}),
];

exports.login = [
	body("login")
		.trim()
		.notEmpty()
		.withMessage("É obrigatório informar um nome de usuário ou email")
		.escape(),
	body("password")
		.trim()
		.notEmpty()
		.withMessage("É obrigatório informar uma senha")
		.escape(),

	asyncHandler(async (req, res, next) => {
		if (req.headers.authorization !== process.env.API_KEY) {
			res.status(401).json({ msg: "Not authorized" });
			return;
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const [user] = await User.find()
			.or([{ username: req.body.login }, { email: req.body.login }])
			.limit(1);
		if (!user) {
			res
				.status(401)
				.json({ message: "Nome de usuário ou senha incorretos tente novamente" });
			return;
		}

		const compareResult = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (compareResult) {
			req.logIn(user, (err) => {
				if (err) throw err;
				res.send({ msg: "Successfully authenticated" });
			});
		} else {
			res
				.status(401)
				.json({ message: "Nome de usuário ou senha incorretos tente novamente" });
		}
	}),
];
exports.sendResetEmail = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("É obrigatório informar um email.")
		.isEmail()
		.withMessage("O email inserido não é um email válido.")
		.escape(),

	asyncHandler(async (req, res, next) => {
		if (req.headers.authorization !== process.env.API_KEY) {
			res.status(401).json({ msg: "Not authorized" });
			return;
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const user = await User.findOne({ email: req.body.email });
		if (user) {
			const tokenLength = 32;
			const token = crypto.randomBytes(tokenLength).toString("hex");
			const urlCode = `${user._id}/${token}`;

			const timestamp = new Date();
			timestamp.setMinutes(timestamp.getMinutes() + 15);

			user.tokenTimestamp = timestamp;
			user.token = token;
			user.save();

			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.EMAIL,
					pass: process.env.APP_PASSWORD,
				},
			});
			const mailOptions = {
				from: `Change your manga shelf password accout<${process.env.EMAIL}>`,
				to: user.email,
				subject: "Mude sua senha",
				text: `${process.env.CLIENT_HOST_ORIGIN}/reset/${urlCode}`,
				html: `<a href="${process.env.CLIENT_HOST_ORIGIN}/reset/${urlCode}">Click here to change your password</a>`,
			};

			transporter
				.sendMail(mailOptions)
				.then(() => res.send({ message: "Email enviado" }))
				.catch((error) => res.send(error));

			return;
		}
		res.status(401).json({ message: "No user with this email" });
	}),
];

exports.resetPassword = [
	body("password")
		.trim()
		.notEmpty()
		.withMessage("É obrigatório informar uma senha")
		.matches(
			/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
		)
		.withMessage(
			"A senha deve conter pelo menos uma letra, número e caractere especial(!@#$%^&*)"
		)
		.isLength({ min: 8 })
		.withMessage("A senha precisa de pelo menos 8 caracteres")
		.escape(),
	body("confirm-password")
		.trim()
		.notEmpty()
		.withMessage("É obrigatório informar uma senha")
		.matches(
			/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
		)
		.withMessage(
			"A senha deve conter pelo menos uma letra, número e caractere especial(!@#$%^&*)"
		)
		.isLength({ min: 8 })
		.withMessage("A senha precisa de pelo menos 8 caracteres")
		.escape(),

	asyncHandler(async (req, res, next) => {
		if (req.headers.authorization !== process.env.API_KEY) {
			res.status(401).json({ msg: "Not authorized" });
			return;
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const currentTimeStamp = new Date();
		const user = await User.findOne({ _id: req.body.userId });
		if (!user || user.token !== req.body.token) {
			res.status(400).json({ message: "Erro: Este link não é valido" });
			return;
		}

		if (currentTimeStamp < user.timestamp) {
			res.status(400).json({ message: "Erro: Esse link já expirou" });
			return;
		}

		const newHashedPassword = await bcrypt.hash(req.body.password, 10);
		user.password = newHashedPassword;
		user.token = null;
		user.save();
		res.send("Password changed successfully");
	}),
];
