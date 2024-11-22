import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function LoginPage() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar login
  const navigate = useNavigate();

  // Verifique se o usuário já está logado ao carregar a página
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      console.log(user.nome)
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.nome)
      console.log(userName)
      setIsLoggedIn(true); // O usuário está logado
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!cpf || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvar no localStorage se o login for bem-sucedido
        localStorage.setItem("user", JSON.stringify(data));
        setIsLoggedIn(true); // Atualizar o estado de login
        navigate("/"); // Redirecionar para a página inicial
      } else {
        setError(data.error || "Erro ao fazer login.");
      }
    } catch (err) {
      setError("Erro de comunicação com o servidor.");
    }
  };

  const handleLogout = () => {
    // Limpar o localStorage e atualizar o estado de login
    localStorage.removeItem("user");
    setIsLoggedIn(false); // Atualizar o estado para indicar que não está mais logado
    navigate("/login"); // Redirecionar para a página de login
  };

  return (
    <div>
      <Navbar />
      <section className="bg-gradient-to-b from-light-orange to-white bg-cover bg-center min-h-[92vh]">
        <div className="flex items-center justify-center w-full h-full">
          {isLoggedIn ? (
            <div className="p-10 text-center">
              <p className="text-black font-semibold text-xl">Bem-vindo(a), {userName}</p>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white p-2 rounded-lg mt-4"
              >
                Sair
              </button>
        </div>
          ) : (
            <form className="p-4 justify-self-center rounded-lg" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="bg-white m-2 text-black rounded-xl px-2"
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="bg-white m-2 text-black rounded-xl px-2"
              />
              <button
                type="submit"
                className="flex bg-white border-2 rounded-xl py-0 px-4 text-black font-semibold justify-self-center self-center hover:bg-gray-200 transition-all"
              >
                Login
              </button>
            </form>
          )}
        </div>
      </section>

      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginPage;
