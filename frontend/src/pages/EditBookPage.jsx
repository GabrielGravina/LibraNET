import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookPage() {
  const { livro_id } = useParams();
  const [bookData, setBookData] = useState({
    titulo: "",
    autor: "",
    prateleira: "",
    ano_publicado: "",
    biblioteca_id: "",
  });
  const [exemplares, setExemplares] = useState([]);
  const [prateleiras, setPrateleiras] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar dados do livro
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/livros/${livro_id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do livro.");
        }
        const data = await response.json();
        setBookData({
          titulo: data.titulo || "Não informado",
          autor: data.autor || "Não informado",
          prateleira: data.prateleira || "Não informado",
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

  // Buscar exemplares e prateleiras
  useEffect(() => {
    const fetchExemplaresAndPrateleiras = async () => {
      try {
        const exemplaresResponse = await fetch(`http://127.0.0.1:5000/api/livros/${livro_id}/exemplares`);
        const prateleirasResponse = await fetch(`http://127.0.0.1:5000/api/bibliotecas/1/prateleiras`);
        if (!exemplaresResponse.ok || !prateleirasResponse.ok) {
          throw new Error("Erro ao buscar exemplares ou prateleiras.");
        }
        const exemplaresData = await exemplaresResponse.json();
        const prateleirasData = await prateleirasResponse.json();
        setExemplares(exemplaresData);
        setPrateleiras(prateleirasData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchExemplaresAndPrateleiras();
  }, [livro_id]);

  const handleExemplarChange = (id, field, value) => {
    setExemplares((prev) =>
      prev.map((exemplar) =>
        exemplar.id === id ? { ...exemplar, [field]: value } : exemplar
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      await Promise.all(
        exemplares.map(async (exemplar) => {
          const response = await fetch(`http://127.0.0.1:5000/api/exemplar/${exemplar.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prateleira_id: exemplar.prateleira_id,
              condicao: exemplar.condicao,
            }),
          });
          if (!response.ok) {
            throw new Error("Erro ao atualizar o exemplar.");
          }
        })
      );
      alert("Alterações salvas com sucesso!");
    } catch (error) {
      alert(`Erro ao salvar alterações: ${error.message}`);
    }
  };

  if (isLoading) return <p>Carregando dados...</p>;

  if (error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>Erro: {error}</p>
      </div>
    );

  return (
    <div className="flex-auto flex-col mb-6 w-3/4 justify-self-center">
      {/* Informações do Livro */}
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
        </div>
      )}

      {/* Lista de Exemplares */}
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Exemplares</h3>
      <div className="space-y-4">
        {exemplares.map((exemplar) => (
          <div key={exemplar.id} className="p-4 bg-gray-100 rounded-md shadow-md">
            <p className="text-gray-600 mb-2">
              <strong>ID:</strong> {exemplar.id}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Estado:</strong> {exemplar.estado}
            </p>
            <label className="text-gray-700 mb-1">Prateleira:</label>
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={exemplar.prateleira_id || ""}
              onChange={(e) =>
                handleExemplarChange(exemplar.id, "prateleira_id", e.target.value)
              }
            >
              <option value="" disabled>
                Selecione uma prateleira
              </option>
              {prateleiras.map((prateleira) => (
                <option key={prateleira.id} value={prateleira.id}>
                  {prateleira.localizacao}
                </option>
              ))}
            </select>
            <label className="text-gray-700 mb-1 mt-2">Condição:</label>
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={exemplar.condicao || ""}
              onChange={(e) =>
                handleExemplarChange(exemplar.id, "condicao", e.target.value)
              }
            >
              <option value="" disabled>
                Selecione a condição
              </option>
              <option value="Bom">Bom</option>
              <option value="Danificado">Danificado</option>
              <option value="Perdido">Perdido</option>
            </select>
          </div>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
        onClick={handleSaveChanges}
      >
        Salvar Alterações
      </button>
    </div>
  );
}
