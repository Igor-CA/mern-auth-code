import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
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
	}

	useEffect(getUser, []);
	return (
		<div className="bg-slate-50 shadow-lg rounded-md text-center fixed bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2 p-10 space-y-5 text-slate-600">
			{userInfo ? (
				<div>
					<h1 className="font-bold text-4xl">
						Bem vindo <u>{userInfo.username}!</u> Como vai?
					</h1>
					<button className="bg-slate-600 text-white p-1 w-full font-semibold rounded-md mt-8" onClick={logout}>
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
