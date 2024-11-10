import { useState } from "react";

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
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginPage;
