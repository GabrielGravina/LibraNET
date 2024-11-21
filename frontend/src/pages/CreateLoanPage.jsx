import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CreateLoanPage() {
  const [livros, setLivros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [livroId, setLivroId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Carregar livros e usuários quando a página for carregada
  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/livros");
        if (response.ok) {
          const data = await response.json();
          console.log("Livros carregados:", data);
          setLivros(data);
        } else {
          console.log("Erro ao carregar livros.");
        }
      } catch (error) {
        console.error("Erro ao fazer a requisição de livros:", error);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/usuarios");
        if (response.ok) {
          const data = await response.json();
          console.log("Usuários carregados:", data);
          setUsuarios(data);
        } else {
          console.log("Erro ao carregar usuários.");
        }
      } catch (error) {
        console.error("Erro ao fazer a requisição de usuários:", error);
      }
    };

    fetchLivros();
    fetchUsuarios();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    console.log("Enviando empréstimo com livro_id:", livroId, "e usuario_id:", usuarioId);

    try {
      // Verificando se os valores estão corretos
      console.log("Tipo de livroId:", typeof livroId, "Tipo de usuarioId:", typeof usuarioId);
      
      // Convertendo o valor do livroId e usuarioId para números
      const livroIdNumber = parseInt(livroId, 10);
      const usuarioIdNumber = parseInt(usuarioId, 10);

      console.log("Livro ID convertido para número:", livroIdNumber);
      console.log("Usuário ID convertido para número:", usuarioIdNumber);

      const response = await fetch("http://127.0.0.1:5000/api/emprestimos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          livro_id: livroIdNumber,  // Passando o livroId como número
          usuario_id: usuarioIdNumber,  // Passando o usuarioId como número
        }),
      });

      if (response.ok) {
        navigate("/emprestimos"); // Redireciona para a página de empréstimos após sucesso
      } else {
        const data = await response.json();
        console.log("Erro ao criar empréstimo:", data);
        setErrorMessage(data.error || "Erro ao criar empréstimo.");
      }
    } catch (error) {
      console.error("Erro ao enviar requisição de empréstimo:", error);
      setErrorMessage("Erro ao criar empréstimo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-md rounded-lg text-black">
        <h1 className="text-2xl font-semibold mb-4">Criar Empréstimo</h1>

        {/* Exibição de erros */}
        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Select para escolher livro */}
          <div className="mb-4">
            <label htmlFor="livro" className="block text-lg font-medium mb-2">
              Selecione o Livro
            </label>
            <select
              id="livro"
              className="w-full p-2 border border-gray-300 rounded-md text-white"
              value={livroId}
              onChange={(e) => {
                console.log("Livro selecionado:", e.target.value); // Log para verificar o livro selecionado
                setLivroId(e.target.value);
              }}
              required
            >
              <option value="">Selecione um livro</option>
              {livros.map((livro) => (
                <option key={livro.id} value={livro.id}>
                  {livro.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Select para escolher usuário */}
          <div className="mb-4">
            <label htmlFor="usuario" className="block text-lg font-medium mb-2">
              Selecione o Usuário
            </label>
            <select
              id="usuario"
              className="w-full p-2 border border-gray-300 rounded-md text-white"
              value={usuarioId}
              onChange={(e) => {
                console.log("Usuário selecionado:", e.target.value); // Log para verificar o usuário selecionado
                setUsuarioId(e.target.value);  // Armazenando o ID do usuário
              }}
              required
            >
              <option value="">Selecione um usuário</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Botão de submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Criando..." : "Criar Empréstimo"}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateLoanPage;
