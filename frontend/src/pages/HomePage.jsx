import { useState, useEffect } from "react";
import FineManagement from "../components/FineManagement";
import LoanList from "../components/LoanList";
import LoginControl from "../components/LoginControl";
import Navbar from "../components/Navbar";
import UserSearchBar from "../components/UserSearchBar";
import "../App.css";
import SearchBar from "../components/SearchBar";

import womanReading from '../images/young-woman-reading-library.jpg'

function HomePage() {
  // Estado para verificar se o usuário está logado
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Estado para simular o tipo de usuário. true representa um admin.
  const [isAdmin, setIsAdmin] = useState(false);

  // Verifica se o usuário está logado ao carregar a página
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      // Verifica se o usuário é admin
      setIsAdmin(userData.isAdmin);
    }
  }, []);

  return (
    <>
      <Navbar />
      <section
        className="w-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 179, 0, 0.3))`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh' // Alterado de height para minHeight
        }}
      >
        <LoginControl isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        <LoanList isAdmin={isAdmin} />
        <SearchBar />
      </section>
    </>
  );
}

export default HomePage;
