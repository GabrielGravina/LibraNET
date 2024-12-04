import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CreateLoanPage() {
  const [livros, setLivros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [exemplares, setExemplares] = useState([]);
  const [livroId, setLivroId] = useState("");
  const [exemplarId, setExemplarId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Carregar livros disponíveis e usuários
  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/livros/disponiveis");
        if (response.ok) {
          const data = await response.json();
          setLivros(data);
        } else {
          console.log("Erro ao carregar livros disponíveis.");
        }
      } catch (error) {
        console.error("Erro ao buscar livros disponíveis:", error);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/usuarios");
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          console.log("Erro ao carregar usuários.");
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchLivros();
    fetchUsuarios();
  }, []);

  // Carregar exemplares disponíveis para o livro selecionado
  useEffect(() => {
    const fetchExemplares = async () => {
      if (!livroId) return;

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/exemplares/${livroId}/disponiveis`);
        if (response.ok) {
          const data = await response.json();
          setExemplares(data);
        } else {
          console.log("Erro ao carregar exemplares disponíveis.");
        }
      } catch (error) {
        console.error("Erro ao buscar exemplares disponíveis:", error);
      }
    };

    fetchExemplares();
  }, [livroId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/emprestimos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exemplar_id: parseInt(exemplarId, 10),
          usuario_id: parseInt(usuarioId, 10),
        }),
      });

      if (response.ok) {
        navigate("/emprestimos"); // Redireciona após sucesso
      } else {
        const data = await response.json();
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
      <div className="flex flex-col justify-start bg-gradient-to-b from-light-orange to-white bg-cover bg-center min-h-[92vh] pt-10">
        <div className="max-w-[40vw] min-w-[20vw] mx-auto p-6 bg-white shadow-md rounded-lg text-black">
          <h1 className="text-2xl font-semibold mb-4">Criar Empréstimo</h1>

          {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            {/* Select para escolher livro */}
            <div className="mb-4">
              <label htmlFor="livro" className="block text-lg font-medium mb-2">
                Selecione o Livro
              </label>
              <select
                id="livro"
                className="w-full p-2 border text-white border-gray-300 rounded-md"
                value={livroId}
                onChange={(e) => {
                  setLivroId(e.target.value);
                  setExemplarId(""); // Limpa a seleção de exemplar
                }}
                required
              >
                <option value="">Selecione um livro</option>
                {livros.map((livro) => (
                  <option key={livro.id} value={livro.id}>
                    {livro.titulo} ({livro.quantidade_exemplares} disponíveis)
                  </option>
                ))}
              </select>
            </div>

            {/* Select para escolher exemplar */}
            {livroId && exemplares.length > 0 && (
              <div className="mb-4">
                <label htmlFor="exemplar" className="block text-black text-lg font-medium mb-2">
                  Selecione o Exemplar
                </label>
                <select
                  id="exemplar"
                  className="w-full p-2 border text-white border-gray-300 rounded-md text-black"
                  value={exemplarId}
                  onChange={(e) => setExemplarId(e.target.value)}
                  required
                >
                  <option value="">Selecione um exemplar</option>
                  {console.log(exemplares, "AQUIII")}
                  {exemplares.map((exemplar) => (
                    <option key={exemplar.id} value={exemplar.id}>
                      Exemplar {exemplar.biblioteca}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Select para escolher usuário */}
            <div className="mb-4">
              <label htmlFor="usuario" className="block text-lg font-medium mb-2">
                Selecione o Usuário
              </label>
              <select
                id="usuario"
                className="w-full p-2 border text-white border-gray-300 rounded-md text-black"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
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
              disabled={isSubmitting || !exemplarId || !usuarioId}
            >
              {isSubmitting ? "Criando..." : "Criar Empréstimo"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateLoanPage;
