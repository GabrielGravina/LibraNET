import { useState } from "react";
import Navbar from "../components/Navbar";

function LoginPage() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

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
        console.log("Usuário logado:", data); // Para depurar e verificar a resposta

        // Armazenar a resposta no localStorage
        localStorage.setItem("user", JSON.stringify(data));

        // Redireciona ou atualiza o estado (se necessário)
        window.location.href = "/"; // Por exemplo, redireciona para a home
      } else {
        setError(data.error || "Erro ao fazer login.");
      }
    } catch (err) {
      setError("Erro de comunicação com o servidor.");
    }
  };

  return (
    <div>
      <Navbar />
      <section className=" bg-gradient-to-b from-light-orange to-white bg-cover bg-center min-h-[92vh]">
        <div  className="flex-auto w-3/4 m-auto">
          <form 
            className="p-4 justify-self-center rounded-lg"
            onSubmit={handleLogin}     
          >
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
          </form>

          <button className="flex bg-white border-2 rounded-xl py-0 px-4 text-black font-semibold justify-self-center self-center hover:bg-gray-200 transition-all" type="submit">Login</button>
        </div>
      
      </section>
      
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginPage;
