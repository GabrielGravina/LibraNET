import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BookPage() {
  const [results, setResults] = useState([]); // Todos os livros
  const [filteredResults, setFilteredResults] = useState([]); // Livros filtrados para exibição
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bibliotecas, setBibliotecas] = useState([]); // Estado para armazenar as bibliotecas
  const [selectedBiblioteca, setSelectedBiblioteca] = useState(""); // Estado para armazenar a biblioteca selecionada

  // Função para buscar todos os livros e bibliotecas disponíveis no back-end
  useEffect(() => {
    async function fetchBibliotecas() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/bibliotecas`);
        const data = await response.json();
        setBibliotecas(data);
      } catch (error) {
        console.error("Erro ao buscar bibliotecas", error);
      }
    }

    async function fetchLivros() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/livros`);
        const data = await response.json();
        setResults(data);
        setFilteredResults(data); // Inicia com todos os livros filtrados
      } catch (error) {
        console.error("Erro ao buscar livros.", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBibliotecas();
    fetchLivros();
  }, []);

  const handleSearch = (event) => {
    const name = event.target.value;
    setSearchTerm(name);

    // Filtra os livros com base no nome e na biblioteca selecionada
    const filtered = results.filter((livro) => {
      const matchesName = livro.titulo.toLowerCase().includes(name.toLowerCase());
      const matchesBiblioteca = selectedBiblioteca
        ? livro.biblioteca_nome === selectedBiblioteca
        : true; // Se nenhuma biblioteca está selecionada, inclui todos

      return matchesName && matchesBiblioteca;
    });

    setFilteredResults(filtered); // Atualiza a lista filtrada
  };

  const handleBibliotecaSelection = (bibliotecaId) => {
    setSelectedBiblioteca(bibliotecaId);
    
    // Filtra novamente os livros com base na biblioteca selecionada
    const filtered = results.filter((livro) => {
      const matchesName = livro.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBiblioteca = bibliotecaId ? livro.biblioteca_nome === bibliotecaId : true; // Inclui todos se nenhuma biblioteca estiver selecionada

      return matchesName && matchesBiblioteca;
    });

    setFilteredResults(filtered); // Atualiza a lista filtrada
  };

  return (
    <div>
      <h3>Listando Livros:</h3>
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
        type="text"
        placeholder="Pesquisar por nome do livro"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Seção de seleção de bibliotecas usando radio buttons */}
      <div className="mb-4">
        <h4>Filtrar por Biblioteca:</h4>
        <div>
          <label>
            <input
              type="radio"
              name="biblioteca"
              value=""
              checked={selectedBiblioteca === ""}
              onChange={() => handleBibliotecaSelection("")}
              className="mr-2"
            />
            Todas
          </label>
          {bibliotecas.map((biblioteca) => (
            <div key={biblioteca.id} className="flex items-center mb-2">
              <input
                type="radio"
                id={`biblioteca-${biblioteca.id}`}
                name="biblioteca"
                value={biblioteca.nome}
                onChange={() => handleBibliotecaSelection(biblioteca.nome)}
                checked={selectedBiblioteca === biblioteca.nome}
                className="mr-2"
              />
              <label htmlFor={`biblioteca-${biblioteca.id}`}>
                {biblioteca.nome}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="loan-list">
        <h2 className="text-2xl font-bold mb-2">Lista de livros:</h2>
        <ul>
          {filteredResults.map((result) => (
            <li key={result.id} className="mb-4 mt-4 p-4 bg-gray-100 rounded-md shadow text-gray-600">
              <p><strong>Título:</strong> {result.titulo}</p>
              <p><strong>Autor:</strong> {result.autor}</p>
              <p><strong>Ano de publicação:</strong> {result.ano_publicado}</p>
              <p><strong>Disponível:</strong> {result.disponivel ? "Sim" : "Não"}</p>
              <p><strong>Status:</strong> {result.status}</p>
              <p><strong>Biblioteca:</strong> {result.biblioteca_nome}</p> {/* Exibe o nome da biblioteca */}
              <div className="mt-2 flex justify-center items-center">
                <Link
                  to={`/livros/${result.id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Editar Livro
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
