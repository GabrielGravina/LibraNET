import React, { useState, useEffect } from "react";

function LoginControl() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Para gerenciar o estado de carregamento

  useEffect(() => {
    // Verifica se o usuário está logado consultando o localStorage
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setIsAdmin(user.admin);  // Mudança aqui: usamos "admin" em vez de "isAdmin"
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }

    setLoading(false); // Finaliza o carregamento
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="text-slate-800">
      {isLoggedIn ? (
        <div>
          <p>Bem-vindo! Você está logado.</p>
          {isAdmin ? (
            <p>Você é um administrador.</p>
          ) : (
            <p>Você é um usuário comum.</p>
          )}
        </div>
      ) : (
        <p>Você não está logado. Faça login para acessar as funcionalidades.</p>
      )}
    </div>
  );
}

export default LoginControl;
