import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ login: "", password: "" });
	const [errors, setErrors] = useState([]);

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
				url: `/api/login`,
			});
			navigate("/");
		} catch (error) {
			if (error.response.data.errors) {
				const validationErrorsList = error.response.data.errors;
				const errors = validationErrorsList.map((error) => {
					return error.msg;
				});
				setErrors((prevErrors) => [...prevErrors, ...errors]);
			} else {
				const customErrorMessage = error.response.data.message;
				setErrors((prevErrors) => [...prevErrors, customErrorMessage]);
			}

			setTimeout(() => {
				setErrors([]);
			}, 5000);
		}
	};

	const handleGoogleLogin = async () => {
		try {
			window.location.href = "/api/auth/google";
		} catch (error) {
			console.error("Google login error:", error);
		}
	};

	const handleInvalid = (e) => {
		e.preventDefault();
		const inputName = e.target.name;
		const input = e.target;

		let customErrorMessage = "";

		if (input.validity.valueMissing) {
			customErrorMessage = `O campo de ${inputName} é obrigatório.`;
		}

		setErrors((prevErrors) => [...prevErrors, customErrorMessage]);

		setTimeout(() => {
			setErrors([]);
		}, 5000);
	};

	const renderErrorsMessage = () => {
		return (
			<div className="bg-red-100 rounded-md border border-red-400 fixed top-2 right-1/2 translate-x-1/2">
				<div>
					{errors.map((erro, index) => {
						return (
							<p
								key={index}
								className="text-red-400 px-10 py-1 font-semibold"
							>
								{erro}
							</p>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<div className="form-container flex flex-col space-y-4 ">
			<h1 className="text-2xl font-bold">Entrar</h1>
			<form
				action="/login"
				method="post"
				className="space-y-4 flex flex-col"
				onSubmit={(e) => {
					handleSubmit(e);
				}}
			>
				<label htmlFor="login" className="hidden">
					Nome de usuário:
				</label>
				<input
					type="text"
					name="login"
					id="login"
					placeholder="Email ou nome de usuário"
					className="bg-slate-100 p-2.5 rounded"
					value={formData.login}
					onChange={(e) => {
						handleChange(e);
					}}
					onInvalid={(e) => {
						handleInvalid(e);
					}}
					required
				/>
				<label htmlFor="password" className="hidden">
					Senha:
				</label>
				<input
					type="password"
					name="password"
					id="password"
					placeholder="Senha"
					className="bg-slate-100 p-2.5 rounded"
					value={formData.password}
					onChange={(e) => {
						handleChange(e);
					}}
					onInvalid={(e) => {
						handleInvalid(e);
					}}
					required
				/>
				<Link
					to={"/forgot"}
					className="text-slate-600 hover:text-slate-600 underline self-end"
				>
					{" "}
					Esqueceu sua senha?
				</Link>
				<button className="bg-slate-600 text-white p-2 font-semibold rounded">
					Logar
				</button>
			</form>
			<button
				type="button"
				onClick={handleGoogleLogin}
				className="bg-slate-600 text-white p-2 font-semibold rounded flex justify-center text-center items-center"
			>
				<svg
					className="mr-2 -ml-1 w-4 h-4"
					aria-hidden="true"
					focusable="false"
					data-prefix="fab"
					data-icon="google"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 488 512"
				>
					<path
						fill="currentColor"
						d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
					></path>
				</svg>
				Logar com o Google
			</button>
			<p className="mt-12">
				Não tem uma conta?
				<Link to={"/signup"} className="text-slate-600 underline">
					{" "}
					clique aqui para criar
				</Link>{" "}
			</p>
			{errors.length > 0 && renderErrorsMessage()}
		</div>
	);
}
