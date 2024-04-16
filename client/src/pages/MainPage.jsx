import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPencil } from "react-icons/fa6";
import Modal from "../components/Modal";

function dataURLtoFile(dataurl, filename) {
    const dataArray = dataurl.split(",")
    const  mime = dataArray[0].match(/:(.*?);/)[1]
    const  bitString = atob(dataArray[dataArray.length - 1])
    let  stringSize = bitString.length
	const  u8dataArray = new Uint8Array(stringSize);
    while (stringSize--) {
      u8dataArray[stringSize] = bitString.charCodeAt(stringSize);
    }
    return new File([u8dataArray], filename, { type: mime });
  }

export default function MainPage() {
	const [userInfo, setUserInfo] = useState(null);
	const [modal, setModal] = useState(false);
	const avatarUrl = useRef(
		"/images/deffault-profile-picture.webp"
	  );

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
		const formData = new FormData();
		const image = dataURLtoFile(avatarUrl.current, "test.webp")
		formData.append("file", image);
		axios({
			method: "POST",
			withCredentials: true,
			url: "http://localhost:3001/api/changeProfilePic",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}).then((res) => {
			console.log(res.data);
		});
	};

	const showModal = () => {
		setModal(true);
	};
	const hideModal = () => {
		setModal(false);
	};

	const updateAvatar = (imgSrc) => {
		avatarUrl.current = imgSrc;
	  };

	useEffect(getUser, []);
	return (
		<div className="bg-slate-50 shadow-lg rounded-md text-center max-w-md mx-auto mt-12 p-10 space-y-5 text-slate-600">
			{userInfo ? (
				modal ? (
					<>
						<Modal closeModal={hideModal} updateAvatar={updateAvatar}></Modal>
					</>
				) : (
					<>
					
						<div className="relative mb-3">
							<img
								src={avatarUrl.current}
								alt="User profile"
								className="rounded-full border-2 border-black shadow-md w-full max-w-xs m-auto"
							/>
							<button
								aria-label="edit-profile-picture"
								className="rounded-full border border-black/60 p-2 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white"
								onClick={showModal}
							>
								<FaPencil className="text-xl" />
							</button>
						</div>
						<h1 className="font-bold text-4xl">
							Bem vindo <u>{userInfo.username}!</u> Como vai?
						</h1>
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
					</>
				)
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
