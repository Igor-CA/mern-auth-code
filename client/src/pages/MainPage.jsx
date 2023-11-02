import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
	const [userInfo, setUserInfo] = useState(null);

	const getUser = () => {
		axios({
			method: "GET",
			withCredentials: true,
			url: "/user",
		}).then((res) => {
			console.log(res);
			setUserInfo(res.data);
		});
	};
	useEffect(getUser,[])
	return (
		<div className="bg-white shadow-lg rounded-md text-center fixed bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2 p-10 space-y-5 text-slate-500">
			{userInfo ? (
				<h1 className="font-bold text-4xl">Bem vindo <u>{userInfo.username}!</u> Como vai?</h1>
			) : (
				< >
					<p className="font-bold text-4xl">Nenhum usuário está logado</p>
					<p className="text-xl">clique <Link to={"/login"} className="text-blue-400 hover:underline">aqui</Link> para logar ou clique <Link to={"/signup"} className="text-blue-400 hover:underline">aqui</Link> para criar uma conta</p>
				</>
			)}
		</div>
	);
}
