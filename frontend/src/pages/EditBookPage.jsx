import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookPage() {
  const { livro_id } = useParams();
  const [bookData, setBookData] = useState({
    titulo: "",
    autor: "",
    prateleira: "",
    ano_publicado: "",
    disponivel: false,
    status: "",
    biblioteca_id: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para buscar os dados do livro
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/livros/${livro_id}`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do livro.");
        }

        const data = await response.json();
        console.log("Dados retornados da API:", data);

        // Atualiza somente se os dados retornarem corretamente
        setBookData({
          titulo: data.titulo || "Não informado",
          autor: data.autor || "Não informado",
          prateleira:
            typeof data.prateleira === "object"
              ? `Código: ${data.prateleira.codigo}, Localização: ${data.prateleira.localizacao}`
              : data.prateleira || "Não informado",
          ano_publicado: data.ano_publicado || "Não informado",
          disponivel: data.disponivel || false,
          status: data.status || "Não informado",
          biblioteca_id: data.biblioteca_id || "Não informado",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookData();
  }, [livro_id]);

  const handleUpdateBook = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/livros/${livro_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao atualizar os dados do livro.");
      }
      const updatedData = await response.json();
      setBookData({
        ...bookData,
        ...updatedData.livro,
      });
      alert("Livro atualizado com sucesso!");
    } catch (error) {
      alert(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (isLoading) return <p>Carregando dados do livro...</p>;

  if (error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>Erro: {error}</p>
      </div>
    );

  return (
    <div className="flex-auto flex-col mb-6">
      {bookData && (
        <div className="flex-col mb-6 p-6 bg-gray-100 rounded-md shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Informações do Livro
          </h3>
          <p className="text-gray-600 text-2xl mb-2">
            <strong>Título:</strong> {bookData.titulo}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Autor:</strong> {bookData.autor}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Ano de Publicação:</strong> {bookData.ano_publicado}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Prateleira:</strong> {bookData.prateleira}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Disponível:</strong> {bookData.disponivel ? "Sim" : "Não"}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Status:</strong> {bookData.status}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Biblioteca:</strong> {bookData.biblioteca_id}
          </p>
        </div>
      )}

      <form onSubmit={handleUpdateBook} className="space-y-4">
      <div className="flex flex-col">
        <label className="text-gray-700 mb-1">Título:</label>
        <input
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          type="text"
          name="titulo"
          value={bookData.titulo}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 mb-1">Autor:</label>
        <input
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          type="text"
          name="autor"
          value={bookData.autor}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 mb-1">Prateleira:</label>
        <input
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          type="text"
          name="prateleira"
          value={bookData.prateleira}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 mb-1">Ano Publicado:</label>
        <input
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          type="text"
          name="ano_publicado"
          value={bookData.ano_publicado}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-gray-700">Disponível:</label>
        <input
          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          type="checkbox"
          name="disponivel"
          checked={bookData.disponivel}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 mb-1">Status:</label>
        <select
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          name="status"
          value={bookData.status}
          onChange={handleChange}
        >
          <option value="Conservado">Conservado</option>
          <option value="Danificado">Danificado</option>
          <option value="Perdido">Perdido</option>
          <option value="Em Reparação">Em Reparação</option>
          <option value="Desconhecido">Desconhecido</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 mb-1">Biblioteca ID:</label>
        <input
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          type="number"
          name="biblioteca_id"
          value={bookData.biblioteca_id}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Atualizar Livro
      </button>

        {/* Repita o mesmo padrão para os demais campos */}
        <button
          type="submit"
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Atualizar Livro
        </button>
      </form>
    </div>
  );
}
