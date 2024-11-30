import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import OpeningBooks from "../images/OpeningBooks.png";


import { motion } from "motion/react"

export default function HomePage() {
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
        className="w-full flex flex-col items-center py-10 justify-start bg-gradient-to-b from-light-orange to-white bg-cover bg-center min-h-[92vh]"
      >
        <h1 className="text-7xl font-semibold ml-2 text-center text-black">
          Libra<span className="text-hard-orange">NET</span>
        </h1>
        
        {/* Texto abaixo do título */}
        <p className="text-xl max-w-4xl  text-center mt-4 text-black opacity-90">
          Bem-vindo ao LibraNET, a plataforma que conecta você ao vasto mundo dos livros! 
          Aqui, você pode explorar, buscar e gerenciar empréstimos de livros com facilidade. 
          Se você é um ávido leitor, um estudante ou apenas quer expandir seus horizontes, 
          temos o que você precisa. Navegue, descubra e comece sua jornada literária hoje mesmo.
        </p>
        
        
        <div className="self-center mt-6">
          <img className="max-w-xl" src={OpeningBooks} alt="Opening Books" />
        </div>
        
        <SearchBar />
      </section>
    </>
  );
}
