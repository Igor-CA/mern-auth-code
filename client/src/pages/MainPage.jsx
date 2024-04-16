import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import UserCard from "../components/UserCard";

function dataURLtoFile(dataurl, filename) {
	const dataArray = dataurl.split(",");
	const mime = dataArray[0].match(/:(.*?);/)[1];
	const bitString = atob(dataArray[dataArray.length - 1]);
	let stringSize = bitString.length;
	const u8dataArray = new Uint8Array(stringSize);
	while (stringSize--) {
		u8dataArray[stringSize] = bitString.charCodeAt(stringSize);
	}
	return new File([u8dataArray], filename, { type: mime });
}

export default function MainPage() {
	const [user, setUser] = useState(null);
	const [modal, setModal] = useState(false);
	const avatarUrl = useRef("/images/deffault-profile-picture.webp");

	const getUser = () => {
		axios({
			method: "GET",
			withCredentials: true,
			url: "/api/user",
		}).then((res) => {
			setUser(res.data);
			avatarUrl.current = res.data.profilePic;
		});
	};

	const uploadImage = () => {
		const formData = new FormData();
		const image = dataURLtoFile(avatarUrl.current, "imageFile.webp");
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
		uploadImage();
	};

	useEffect(getUser, []);
	return (
		<div className="bg-slate-50 shadow-lg rounded-md text-center max-w-md mx-auto mt-12 p-10 space-y-5 text-slate-600">
			{user ? (
				<>
					<UserCard
						user={user}
						showModal={showModal}
						setUser={setUser}
						avatarUrl={avatarUrl}
					></UserCard>
					{modal && (
						<Modal
							closeModal={hideModal}
							updateAvatar={updateAvatar}
						></Modal>
					)}
				</>
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
