import { useState } from "react";
import FineManagement from "../components/FineManagement";
import LoanList from "../components/LoanList";
import LoginControl from "../components/LoginControl";
import Navbar from "../components/Navbar";
import UserSearchBar from "../components/UserSearchBar";
import "../App.css";
import SearchBar from "../components/SearchBar";

function HomePage() {
	// Estado para simular o tipo de usuário. true representa um admin.
	const [isAdmin, setIsAdmin] = useState(false); // Ajuste para true se quiser testar como admin

	const toggleAdmin = () => {
		setIsAdmin(!isAdmin);
	};

	return (
		<>
			<Navbar />

			<LoginControl isAdmin={isAdmin} toggleAdmin={toggleAdmin} />
			<LoanList isAdmin={isAdmin} />
			<SearchBar />
			{console.log(isAdmin)}
		</>
	);
}

export default HomePage;
