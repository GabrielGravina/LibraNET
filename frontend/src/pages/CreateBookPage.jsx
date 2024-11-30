import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CreateBookPage() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anoPublicacao, setAnoPublicacao] = useState("");
  const [categoria, setCategoria] = useState(""); // Adicionando o estado para Categoria
  const [prateleiraId, setPrateleiraId] = useState(""); // Adicionando o estado para prateleira_id
  const [bibliotecaId, setBibliotecaId] = useState(""); // Adicionando o estado para biblioteca_id
  const [errorMessage, setErrorMessage] = useState("");
  const [quantidadeExemplares, setQuantidadeExemplares] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    // Verificando se todos os campos obrigatórios estão preenchidos
    if (!titulo || !autor || !anoPublicacao || !categoria || !prateleiraId || !bibliotecaId) {
      setErrorMessage("Todos os campos são obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    // Verificando se o ano de publicação é válido
    if (anoPublicacao < 0 || anoPublicacao > new Date().getFullYear()) {
      setErrorMessage("O ano de publicação deve ser entre 0 e o ano atual.");
      setIsSubmitting(false);
      return;
    }

    // Verificando se a categoria é uma string válida
    if (!isNaN(categoria)) {
      setErrorMessage("A categoria deve ser uma string válida.");
      setIsSubmitting(false);
      return;
    }

    // Verificando se prateleiraId e bibliotecaId são números válidos
    if (isNaN(prateleiraId) || isNaN(bibliotecaId)) {
      setErrorMessage("prateleiraId e bibliotecaId devem ser números válidos.");
      setIsSubmitting(false);
      return;
    }

    const newBook = {
      titulo,
      autor,
      ano_publicacao: anoPublicacao,
      categoria,
      prateleira_id: prateleiraId,  
      biblioteca_id: bibliotecaId,  
      quantidade_exemplares: quantidadeExemplares
    };

    console.log("Dados do livro enviados:", newBook);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/livros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        navigate("/livros"); // Redireciona para a página de livros após sucesso
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Erro ao criar livro.");
      }
    } catch (error) {
      console.error("Erro ao enviar requisição de criação de livro:", error);
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

            {/* Exibição de erros */}
            {errorMessage && (
                <div className="mb-4 text-red-500">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Campo para título */}
                <div className="mb-4">
                <label htmlFor="titulo" className="block text-lg font-medium mb-2">
                    Título
                </label>
                <input
                    type="text"
                    id="titulo"
                    className="w-full p-2 border bg-gray-600 bg-gray-600 border-gray-300 rounded-md text-white"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />
                </div>

                {/* Campo para autor */}
                <div className="mb-4">
                <label htmlFor="autor" className="block text-lg font-medium mb-2">
                    Autor
                </label>
                <input
                    type="text"
                    id="autor"
                    className="w-full p-2 border border-gray-300 bg-gray-600 rounded-md text-white"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                    required
                />
                </div>

                {/* Campo para ano de publicação */}
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

                {/* Campo para categoria */}
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

                {/* Campo para prateleira_id */}
                <div className="mb-4">
                <label htmlFor="prateleiraId" className="block text-lg font-medium mb-2">
                    Prateleira ID
                </label>
                <input
                    type="number"
                    id="prateleiraId"
                    className="w-full p-2 border bg-gray-600 border-gray-300 rounded-md text-white"
                    value={prateleiraId}
                    onChange={(e) => setPrateleiraId(e.target.value)}
                    required
                />
                </div>

                {/* Campo para biblioteca_id */}
                <div className="mb-4">
                <label htmlFor="bibliotecaId" className="block text-lg font-medium mb-2">
                    Biblioteca ID
                </label>
                <input
                    type="number"
                    id="bibliotecaId"
                    className="w-full p-2 border bg-gray-600 border-gray-300 rounded-md text-white"
                    value={bibliotecaId}
                    onChange={(e) => setBibliotecaId(e.target.value)}
                    required
                />
                </div>

                {/* Campo para número de exemplares que serão criados */}
                <div className="mb-4">
                <label htmlFor="bibliotecaId" className="block text-lg font-medium mb-2">
                    Número de exemplares
                </label>
                <input
                    type="number"
                    id="quantidadeExemplares"
                    className="w-full p-2 border bg-gray-600 border-gray-300 rounded-md text-white"
                    value={quantidadeExemplares}
                    onChange={(e) => setQuantidadeExemplares(e.target.value)}
                    required
                />
                </div>

                {/* Botão de submit */}
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
