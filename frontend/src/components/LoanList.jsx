import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function LoanList(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Verifica se o usuário é admin
  const [userId, setUserId] = useState(null); // Armazena o ID do usuário logado

  // Função para verificar se o usuário é admin e obter o ID do usuário
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
	  console.log(userData)
      setIsAdmin(userData.admin); // Define o estado isAdmin com base nos dados armazenados no localStorage
	  console.log(userData.admin)
      setUserId(userData.id); // Armazena o ID do usuário logado
	  console.log(userData.id)
    }
  }, []);

  // Função de pesquisa
  const handleSearch = async (event) => {
    const name = event.target.value;
    setSearchTerm(name);
    setIsLoading(true);

    if (name.length > 0) {
      try {
        let url;
        // Se for admin, busca todos os empréstimos. Se não, busca os empréstimos do usuário logado.
        if (isAdmin) {
          url = `http://127.0.0.1:5000/api/usuarios/emprestimos/nome/${name}`;
        } else {
          url = `http://127.0.0.1:5000/api/usuarios/emprestimos/${userId}/nome/${name}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          console.log("Erro ao buscar dados.");
        }
      } catch (error) {
        console.log("Erro ao fazer a requisição", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
      setIsLoading(false);
    }
  };

  // Função para buscar empréstimos do usuário logado, caso não seja admin
  const fetchUserLoans = async () => {
    try {
        setIsLoading(true);
        const response = await fetch(
            isAdmin 
                ? `http://127.0.0.1:5000/api/usuarios/emprestimos/nome/${searchTerm}`
                : `http://127.0.0.1:5000/api/emprestimo/user/${userId}`
        );

        if (response.ok) {
            const data = await response.json();
            setResults(data);
        } else {
            console.log("Erro ao buscar dados.");
        }
    } catch (error) {
        console.log("Erro ao fazer a requisição", error);
        setResults([]);
    } finally {
        setIsLoading(false);
    }
};

  useEffect(() => {
    if (!isAdmin && userId) {
      fetchUserLoans(); // Chama a função para buscar os empréstimos do usuário logado
    }
  }, [isAdmin, userId]);

  // Função para marcar devolução
  const handleDevolucao = async (emprestimoId) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/emprestimos/${emprestimoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devolvido: true }),
      });

      const updatedResults = results.map((emp) =>
        emp.emprestimo_id === emprestimoId ? { ...emp, devolvido: true } : emp
      );

      console.log("Resultados atualizados:", updatedResults);
      setResults(updatedResults);
    } catch (error) {
      console.error("Erro ao marcar devolução: ", error);
    }
  };

  return (
    <div className="flex-auto w-full m-auto bg-gradient-to-b from-light-orange to-white bg-cover bg-center min-h-[92vh]">
      {/* Renderiza a barra de pesquisa apenas se for admin */}
      {isAdmin && (
        <div className="mb-6 justify-self-center">
          <input
            className="w-96 p-3 mb-4 mt-6 border-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
            type="text"
            placeholder="Pesquisar por nome do usuário"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      )}

      {/* Lista de Empréstimos */}
      <div className="loan-list">
        <h2 className="justify-self-center text-4xl font-semibold mb-2 text-amber-600">
          {isAdmin
            ? "Todos os dados dos empréstimos"
            : "Seus empréstimos:"}
        </h2>
        <p className="mb-4 text-black"></p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-4/5 mx-auto p-12">
          {results.map((result) => (
            <li
              key={result.emprestimo_id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition duration-300"
            >
              <p className="font-medium text-lg text-gray-800"> 
				{isAdmin 
				? result.usuario_nome
				: "" }
			  	
				
			</p>
              <p className="text-sm text-gray-600">ID do empréstimo: {result.emprestimo_id}</p>
              <p className="text-sm text-gray-600">Livro: {result.livro_titulo}</p>
              <p className="text-sm text-gray-600">Data do Empréstimo: {result.data_emprestimo}</p>
              <p className="text-sm text-gray-600">Data de Devolução: {result.data_devolucao}</p>
              <p className="text-sm text-gray-600">
                Valor da multa: {result.multa > 0 ? <span className="font-semibold text-hard-orange">R${result.multa},00</span> : "Não há"}</p>
              <p
                className={`text-sm font-semibold ${result.devolvido ? 'text-green-500' : 'text-red-500'}`}
              >
                Status: {result.devolvido ? "Devolvido" : "Não devolvido"}
              </p>
              {/* Mostrar botão editar apenas para admins */}
              {isAdmin && (
                <div className="mt-4 text-center">
                  <Link
                    to={`/emprestimo/${result.emprestimo_id}`}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Editar Empréstimo
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LoanList;
