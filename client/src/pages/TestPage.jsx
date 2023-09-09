import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function TestPage(){
    const [signupName, setSingupName] = useState("");
	const [signupPassword, setSingupPassword] = useState("");
    const [signupEmail, setSingupEmail] = useState("");
	const [loginName, setLoginName] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [userInfo, setUserInfo] = useState(null);

	const signup = () => {
		try {
			axios({
				method: "POST",
				data: {
					username: signupName,
                    email: signupEmail,
					password: signupPassword,
				},
				withCredentials: true,
				url: "http://localhost:3001/signup",
			}).then((res) => console.log(res));
		} catch (err) {
			console.log(err);
		}
	};
	const login = () => {
		try {
			axios({
				method: "POST",
				data: {
					username: loginName,
					password: loginPassword,
				},
				withCredentials: true,
				url: "http://localhost:3001/login",
			}).then((res) => console.log(res));
		} catch (err) {
			console.log(err);
		}
	};
	const getUser = () => {
		axios({
			method: "GET",
			withCredentials: true,
			url: "http://localhost:3001/user",
		}).then((res) => {
			console.log(res);
			setUserInfo(res.data);
		});
	};
    return(
        <div className="App">
			<div>
				<h1>Signup</h1>
				<input
					type="text"
					placeholder="name"
					onChange={(e) => setSingupName(e.target.value)}
				></input>
				<input
					type="text"
					placeholder="password"
					onChange={(e) => setSingupPassword(e.target.value)}
				></input>
				<input
					type="text"
					placeholder="email"
					onChange={(e) => setSingupEmail(e.target.value)}
				></input>
				<button onClick={signup}>Submit</button>
			</div>

			<div>
				<h1>Login</h1>
				<input
					type="text"
					placeholder="name"
					onChange={(e) => setLoginName(e.target.value)}
				></input>
				<input
					type="text"
					placeholder="password"
					onChange={(e) => setLoginPassword(e.target.value)}
				></input>
				<button onClick={login}>Submit</button>
			</div>
			
			<div>
				<Link to={'/forgot'}>Forget password</Link>
			</div>
			<div>
				<h1>User</h1>
				<button onClick={getUser}>User info</button>
			</div>
			{userInfo ? <h2>Whelcome {userInfo.username}</h2> : null}
		</div>
    )
}