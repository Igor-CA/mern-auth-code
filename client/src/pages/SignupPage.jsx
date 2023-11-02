import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function SignupPage() {
	const navigate = useNavigate();
	const [errors, setErrors] = useState([]);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		email: "",
		"confirm-password": "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios({
				method: "POST",
				data: formData,
				withCredentials: true,
				headers: {
					Authorization: process.env.REACT_APP_API_KEY,
				},
				url: `/signup`,
			});
			navigate("/login");
		} catch (error) {
			const customErrorMessage = error.response.data.message;
			setErrors((prevErrors) => [...prevErrors, customErrorMessage]);

			
			setTimeout(() => {
				setErrors([]);
			}, 5000);
		}
	};

	const renderErrorsMessage = () => {
		return (
			<div className="bg-red-100 rounded-md border border-red-400 fixed top-2 right-1/2 translate-x-1/2">
				<div>
					{errors.map((erro, index) => {
						return (
							<p key={index} className="text-red-400 px-10 py-1 font-semibold">
								{erro}
							</p>
						);
					})}
				</div>
			</div>
		);
	};

	const handleInvalid = (e) => {
		e.preventDefault();
		const inputName = e.target.name;
		const input = e.target;

		const validationMessages = {
			email: {
				valueMissing: "É obrigatório informar um email",
				typeMismatch: "O email inserido não é um email válido",
			},
			username: {
				valueMissing: "É obrigatório informar um nome de usuário",
				patternMismatch:
					"O nome de usuário não pode ter caracteres especiais (!@#$%^&*) e deve ter entre 3 e 16 caracteres.",
			},
			password: {
				valueMissing: "A senha é obrigatória",
				patternMismatch:
					"A senha deve conter pelo menos uma letra, número e caractere especial(!@#$%^&*)",
				tooShort: "A senha precisa de pelo menos 8 caracteres",
			},
			"confirm-password": {
				valueMissing: "O campo de confirmar senha é obrigatório",
				patternMismatch: "As senhas devem coincidir",
			},
			"tos-checkbox": {
				valueMissing: "Concorde com nossos termos para criar uma conta",
			},
		};

		const validationTypes = [
			"tooShort",
			"patternMismatch",
			"typeMismatch",
			"valueMissing",
		];
		const inputValidity = validationTypes.find((type) => input.validity[type]);

		const customErrorMessage = validationMessages[inputName][inputValidity];

		setErrors((prevErrors) => [...prevErrors, customErrorMessage]);

		setTimeout(() => {
			setErrors([]);
		}, 5000);
	};

	return (
		<div className="mt-10 mx-auto mb-2 bg-white rounded-lg w-full max-w-sm text-center text-slate-500 shadow-2xl p-10">
			<h1 className="text-2xl font-bold pb-12">Criar conta</h1>
			<form
				method="post"
				className="space-y-4 flex flex-col"
				onSubmit={(e) => {
					handleSubmit(e);
				}}
			>
				<label htmlFor="email" className="hidden">
					Email:
				</label>
				<input
					type="email"
					name="email"
					placeholder="Email"
					id="email"
					className="bg-gray-100 p-2.5 rounded"
					onChange={(e) => {
						handleChange(e);
					}}
					onInvalid={(e) => {
						handleInvalid(e);
					}}
					required
				/>
				<label htmlFor="username" className="hidden">
					User name:{" "}
				</label>
				<input
					type="text"
					name="username"
					placeholder="Nome de usuário"
					id="username"
					className="bg-gray-100 p-2 rounded"
					onChange={(e) => {
						handleChange(e);
					}}
					onInvalid={(e) => {
						handleInvalid(e);
					}}
					required
					pattern="^[A-Za-z0-9]{3,16}$"
					maxLength="16"
				/>
				<label htmlFor="password" className="hidden">
					Password:
				</label>
				<input
					type="password"
					name="password"
					placeholder="Senha"
					id="password"
					className="bg-gray-100 p-2 rounded"
					onChange={(e) => {
						handleChange(e);
					}}
					onInvalid={(e) => {
						handleInvalid(e);
					}}
					required
					pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
					minLength="8"
				/>
				<label htmlFor="confirm-password" className="hidden">
					Confirm password:
				</label>
				<input
					type="password"
					name="confirm-password"
					placeholder="Confirmar senha"
					id="confirm-password"
					className="bg-gray-100 p-2 rounded"
					onChange={(e) => {
						handleChange(e);
					}}
					onInvalid={(e) => {
						handleInvalid(e);
					}}
					required
					pattern={formData.password}
				/>
				<label htmlFor="tos-checkbox" className="text-justify">
					<input
						type="checkbox"
						name="tos-checkbox"
						id="tos-checkbox"
						className="mr-2"
						required
						onInvalid={(e) => {
							handleInvalid(e);
						}}
						onChange={(e) => {
							handleChange(e);
						}}
					/>
					Ao marcar esta aba você concorda com nosso <strong className="font-semibold text-blue-400 cursor-pointer">termos e condições</strong>
				</label>
				<button className="bg-blue-400 text-white p-1 w-full font-semibold rounded-md">
					Criar conta
				</button>
				<Link to={"/login"} className="text-blue-400">
					Já tem conta?
				</Link>
			</form>
			{errors.length > 0 && renderErrorsMessage()}
		</div>
	);
}
