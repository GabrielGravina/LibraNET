import LoanList from "../components/LoanList"
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";


export default function LoansPage(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    return(
        <>
          <Navbar />
          <LoanList isAdmin={isAdmin} />
        
        </>
    )
}