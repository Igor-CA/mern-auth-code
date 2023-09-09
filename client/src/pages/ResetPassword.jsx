import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
    const {userId, token} = useParams()
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

    const ResetPassword = () => {
		try {
			axios({
				method: "POST",
				data: {
                    userId: userId,
                    token: token,
					password: password,
                    confirmPassword: confirmPassword
				},
				withCredentials: true,
				url: "http://localhost:3001/change-password",
			}).then((res) => console.log(res));
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<div>
			<h1>Signup</h1>
			<input
				type="text"
                value={password}
				placeholder="password"
				onChange={(e) => setPassword(e.target.value)}
			></input>
			<input
				type="text"
                value={confirmPassword}
				placeholder="confirm password"
				onChange={(e) => setConfirmPassword(e.target.value)}
			></input>
			<button onClick={ResetPassword}>Submit</button>
		</div>
	);
}
