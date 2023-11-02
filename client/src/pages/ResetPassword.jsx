import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResetPasswordPage() {
	const { userId, token } = useParams();
	const [formData, setFormData] = useState({ email: "" });
	const [errors, setErrors] = useState([]);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios({
				method: "POST",
				data: { ...formData, userId, token },
				withCredentials: true,
				headers: {
					Authorization: process.env.REACT_APP_API_KEY,
				},
				url: `/api/reset-password`,
			});
			navigate("/login");
		} catch (error) {
			if (error.response.data.errors){
				const validationErrorsList = error.response.data.errors
				const errors = validationErrorsList.map(error => {return error.msg})
				setErrors((prevErrors) => [...prevErrors, ...errors])
			}else{
				const customErrorMessage = error.response.data.message;
				setErrors((prevErrors) => [...prevErrors, customErrorMessage]);
			}

			setTimeout(() => {
				setErrors([]);
			}, 5000);
		}
	};

	const handleInvalid = (e) => {
		e.preventDefault();
		const inputName = e.target.name;
		const input = e.target;

		const validationMessages = {
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
		<div className="mt-10  mx-auto mb-2 bg-white rounded-lg w-full max-w-sm text-center text-slate-500 shadow-2xl p-10">
			<h1 className="text-2xl font-bold">Defina sua nova senha</h1>
			<form
				method="post"
				className="space-y-4 flex flex-col"
				onSubmit={(e) => {
					handleSubmit(e);
				}}
			>
				<label htmlFor="password" className="hidden">
					Senha:
				</label>
				<input
					type="password"
					name="password"
					placeholder="Password"
					id="password"
					className="bg-gray-100 p-2.5 rounded"
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
					Confirme sua senha:
				</label>
				<input
					type="password"
					name="confirm-password"
					placeholder="Confirm password"
					id="confirm-password"
					className="bg-gray-100 p-2.5 rounded"
					onChange={(e) => {
						handleChange(e);
					}}
					onInvalid={(e) => {
						handleInvalid(e);
					}}
					required
					pattern={formData.password}
				/>
				<button className="bg-blue-400 text-white p-1 font-semibold rounded">
					Definir nova senha
				</button>
				<Link to={"/login"} className="text-blue-400">
					Entrar
				</Link>
			</form>
			{errors.length > 0 && renderErrorsMessage()}
		</div>
	);
}
