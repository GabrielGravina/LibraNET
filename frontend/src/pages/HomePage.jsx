import { useState } from "react";
import FineManagement from "../components/FineManagement";
import LoanList from "../components/LoanList";
import LoginControl from "../components/LoginControl";
import Navbar from "../components/Navbar";
import UserSearchBar from "../components/UserSearchBar";
import "../App.css";
import SearchBar from "../components/SearchBar";

import womanReading from '../images/young-woman-reading-library.jpg'

function HomePage() {
	// Estado para simular o tipo de usuário. true representa um admin.
	const [isAdmin, setIsAdmin] = useState(false); // Ajuste para true se quiser testar como admin

	const toggleAdmin = () => {
		setIsAdmin(!isAdmin);
	};

	return (
		<>
			<Navbar />
			<section
				className="w-full"
				style={{
					backgroundImage: `linear-gradient(to bottom, rgba(255, 179, 0, 0.3), transparent), url(${womanReading})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					minHeight: '80vh' // Alterado de height para minHeight
				}}	
			>
				<LoginControl isAdmin={isAdmin} toggleAdmin={toggleAdmin} />
				<LoanList isAdmin={isAdmin} />
				<SearchBar />
			</section>
			{console.log(isAdmin)}
		</>
	);
}

export default HomePage;
