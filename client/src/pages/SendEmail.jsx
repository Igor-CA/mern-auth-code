import axios from "axios";
import { useState } from "react";

export default function SendEmail(){
    const [email, setEmail] = useState("");

    const sendEmail = () => {
		try {
			axios({
				method: "POST",
				data: {
					email: email,
				},
				withCredentials: true,
				url: "http://localhost:3001/send-mail",
			}).then((res) => console.log(res));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<h1>Forgot password</h1>
			<input
				type="text"
                value={email}
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
			></input>
			<button onClick={sendEmail}>Submit</button>
		</div>
    )
}