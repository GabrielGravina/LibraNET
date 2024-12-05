import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CreateBookPage() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anoPublicacao, setAnoPublicacao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prateleiraId, setPrateleiraId] = useState("");
  const [quantidadeExemplares, setQuantidadeExemplares] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    // Validações básicas
    if (!titulo || !autor || !anoPublicacao || !categoria) {
      setErrorMessage("Todos os campos obrigatórios devem ser preenchidos.");
      setIsSubmitting(false);
      return;
    }

    if (anoPublicacao < 0 || anoPublicacao > new Date().getFullYear()) {
      setErrorMessage("O ano de publicação deve ser válido.");
      setIsSubmitting(false);
      return;
    }

    const newBook = {
      titulo,
      autor,
      ano_publicacao: anoPublicacao,
      categoria,
    };

    // Adicionar somente se os campos forem preenchidos
    if (quantidadeExemplares) {
      newBook.quantidade_exemplares = parseInt(quantidadeExemplares, 10);
    }
    if (prateleiraId) {
      const parsedPrateleiraId = parseInt(prateleiraId, 10);
      if (isNaN(parsedPrateleiraId)) {
        setErrorMessage("O ID da prateleira deve ser um número válido.");
        setIsSubmitting(false);
        return;
      }
      newBook.prateleira_id = parsedPrateleiraId;
    }
    console.log("Payload enviado:", newBook);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/livros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        navigate("/livros");
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Erro ao criar livro.");
      }
    } catch (error) {
      console.error("Erro ao criar livro:", error);
      setErrorMessage("Erro ao criar livro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex-col justify-center m-auto">
        <section className="bg-gradient-to-b from-light-orange to-white bg-cover bg-center min-h-[92vh] flex items-center justify-center">
          <div className="min-w-[22vw] mx-auto p-6 bg-white shadow-md rounded-lg text-black">
            <h1 className="text-2xl font-semibold mb-4">Criar Livro</h1>

            {errorMessage && (
              <div className="mb-4 text-red-500">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="titulo" className="block text-lg font-medium mb-2">
                  Título
                </label>
                <input
                  type="text"
                  id="titulo"
                  className="w-full p-2 border bg-gray-600 border-gray-300 rounded-md text-white"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="autor" className="block text-lg font-medium mb-2">
                  Autor
                </label>
                <input
                  type="text"
                  id="autor"
                  className="w-full p-2 border bg-gray-600 border-gray-300 rounded-md text-white"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="anoPublicacao" className="block text-lg font-medium mb-2">
                  Ano de Publicação
                </label>
                <input
                  type="number"
                  id="anoPublicacao"
                  className="w-full p-2 border bg-gray-600 border-gray-300 rounded-md text-white"
                  value={anoPublicacao}
                  onChange={(e) => setAnoPublicacao(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="categoria" className="block text-lg font-medium mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  id="categoria"
                  className="w-full p-2 border bg-gray-600 border-gray-300 rounded-md text-white"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="prateleiraId" className="block text-lg font-medium mb-2">
                  ID da Prateleira (Opcional)
                </label>
                <input
                  type="number"
                  id="prateleiraId"
                  className="w-full p-2 border bg-gray-600 border-gray-300 rounded-md text-white"
                  value={prateleiraId}
                  onChange={(e) => setPrateleiraId(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="quantidadeExemplares"
                  className="block text-lg font-medium mb-2"
                >
                  Número de Exemplares (Opcional)
                </label>
                <input
                  type="number"
                  id="quantidadeExemplares"
                  className="w-full p-2 border bg-gray-600 border-gray-300 rounded-md text-white"
                  value={quantidadeExemplares}
                  onChange={(e) => setQuantidadeExemplares(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-b from-amber-600 to-orange shadow-lg bg-cover bg-center text-white p-3 rounded-md hover:bg-gradient-to-b hover:from-hard-orange hover:to-hard-orange disabled:opacity-50 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar Livro"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CreateBookPage;

