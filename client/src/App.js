import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import axios from "axios";
import TestPage from "./pages/TestPage";
import ResetPassword from "./pages/ResetPassword";
import SendEmail from "./pages/SendEmail";
function App() {
	
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<TestPage />}></Route>
					<Route path="/forgot" element={<SendEmail />}></Route>
					<Route path="/reset/:userId/:token" element={<ResetPassword />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
