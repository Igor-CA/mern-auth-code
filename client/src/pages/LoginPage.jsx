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
			navigate("/")
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
							<p key={index} className="text-red-400 px-10 py-1 font-semibold">
								{erro}
							</p>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<div className="form-container">
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
					className="bg-gray-100 p-2.5 rounded"
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
					className="bg-gray-100 p-2.5 rounded"
					value={formData.password}
					onChange={(e) => {
						handleChange(e);
					}}
					onInvalid={(e) => {
						handleInvalid(e);
					}}
					required
				/>

				<button className="bg-blue-400 text-white p-1 font-semibold rounded">Log in</button>
				<p>
					Não tem uma conta?
					<Link to={"/signup"} className="text-blue-400">
						{" "}
						clique aqui
					</Link>{" "}
					para criar
				</p>
				<Link to={"/forgot"} className="text-blue-400">
					Esqueceu sua senha?
				</Link>

			</form>
			{errors.length > 0 && renderErrorsMessage()}
		</div>
	);
}
