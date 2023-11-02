import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import MainPage from "./pages/MainPage";
import ResetPassword from "./pages/ResetPassword";
import SendEmail from "./pages/ForgotPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
function App() {
	
	return (
		<div className="bg-gray-100">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainPage />}></Route>
					<Route path="/signup" element={<SignupPage />}></Route>
					<Route path="/login" element={<LoginPage />}></Route>
					<Route path="/forgot" element={<SendEmail />}></Route>
					<Route path="/reset/:userId/:token" element={<ResetPassword />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
