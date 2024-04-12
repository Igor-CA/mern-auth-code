import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
	const [file, setFile] = useState()
	const [userInfo, setUserInfo] = useState(null);

	const getUser = () => {
		axios({
			method: "GET",
			withCredentials: true,
			url: "/api/user",
		}).then((res) => {
			setUserInfo(res.data);
		});
	};

	const logout = () => {
		axios({
			method: "GET",
			withCredentials: true,
			url: "/api/logout",
		}).then((res) => {
			console.log(res);
			setUserInfo(null);
		});
	};

	const uploadImage = () => {
		console.log()
		const formData = new FormData()
		formData.append("file", file)
		console.log(formData)
		axios({
			method: "POST",
			withCredentials: true,
			url: "http://localhost:3001/api/changeProfilePic",
			data: formData, 
			headers: {
				"Content-Type": "multipart/form-data" 
			}
		}).then((res) => {
			console.log(res.data);
		});
	}

	useEffect(getUser, []);
	return (
		<div className="bg-slate-50 shadow-lg rounded-md text-center fixed bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2 p-10 space-y-5 text-slate-600">
			{userInfo ? (
				<div>
					<h1 className="font-bold text-4xl">
						Bem vindo <u>{userInfo.username}!</u> Como vai?
					</h1>
					<label
						htmlFor="file"
						className="bg-slate-600 text-white p-1 block w-full font-semibold rounded-md mt-8"
					>
						Image
					</label>
					<input
						type="file"
						name="file"
						id="file"
						accept="image/*"
						className="hidden"
						onChange={(e) => setFile(e.target.files[0])}
					/>
					<button
						className="bg-slate-600 text-white p-1 w-full font-semibold rounded-md mt-8"
						onClick={uploadImage}
					>
						enviar imagem
					</button>
					<button
						className="bg-slate-600 text-white p-1 w-full font-semibold rounded-md mt-8"
						onClick={logout}
					>
						Sair da conta
					</button>
				</div>
			) : (
				<>
					<p className="font-bold text-4xl">
						Nenhum usuário está logado
					</p>
					<p className="text-xl">
						clique{" "}
						<Link
							to={"/login"}
							className="text-slate-600 underline"
						>
							aqui para logar
						</Link>{" "}
						ou clique{" "}
						<Link
							to={"/signup"}
							className="text-slate-600 underline"
						>
							aqui para criar uma conta
						</Link>{" "}
					</p>
				</>
			)}
		</div>
	);
}
