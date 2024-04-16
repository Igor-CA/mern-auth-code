import axios from "axios";
import { FaPencil } from "react-icons/fa6";

export default function UserCard({user,showModal,setUser, avatarUrl}) {
    const logout = () => {
		axios({
			method: "GET",
			withCredentials: true,
			url: "/api/logout",
		}).then((res) => {
			console.log(res);
			setUser(null);
		});
	};
	return (
		<>
			<div className="relative mb-3">
				<img
					src={avatarUrl.current}
					alt="User profile"
					className="rounded-full shadow-lg w-full max-w-xs m-auto"
				/>
				<button
					aria-label="edit-profile-picture"
					className="rounded-full border border-slate-600/60 p-2 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white"
					onClick={showModal}
				>
					<FaPencil className="text-xl" />
				</button>
			</div>
			<h1 className="font-bold text-4xl">
				Bem vindo <u>{user.username}!</u> Como vai?
			</h1>
			<button
				className="bg-slate-600 text-white p-1 w-full font-semibold rounded-md mt-8"
				onClick={logout}
			>
				Sair da conta
			</button>
		</>
	);
}
