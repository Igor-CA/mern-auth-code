import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPage() {
	const [formData, setFormData] = useState({ email: "" });
	const [errors, setErrors] = useState([]);

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
				data: formData,
				withCredentials: true,
				headers: {
					Authorization: process.env.REACT_APP_API_KEY,
				},
				url: `/forgot`,
			});
		} catch (error) {
			const customErrorMessage = error.response.data.message;
			setErrors((prevErrors) => [...prevErrors, customErrorMessage]);

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
			customErrorMessage = `${inputName} field is required.`;
		}

		setErrors((prevErrors) => [...prevErrors, customErrorMessage]);

		setTimeout(() => {
			setErrors([]);
		}, 5000);
	};

	return (
		<div className="mt-10 mx-auto mb-2 bg-white rounded-lg w-full max-w-sm text-center text-slate-500 shadow-2xl p-10">
			<h1 className="text-2xl font-bold">Mude sua senha</h1>
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
					type="text"
					name="email"
					id="email"
					placeholder="Email"
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
				<button className="bg-blue-400 text-white p-1 font-semibold rounded">Mudar senha</button>
				<Link to={"/login"} className="text-blue-400">
					Entrar
				</Link>
			</form>
			{errors.length > 0 && renderErrorsMessage()}
		</div>
	);
}
