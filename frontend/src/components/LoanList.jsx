import React, { useState } from "react";
import { Link } from "react-router-dom";

function LoanList(props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleEditButton = () => {
        console.log("Ignore");
    };

    const handleSearch = async (event) => {
        const name = event.target.value;
        setSearchTerm(name);
        setIsLoading(true);

        if (name.length > 0) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/usuarios/emprestimos/nome/${name}`);
                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                    console.log(results.data);
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
        <>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                type="text"
                placeholder="Pesquisar por nome do usuário"
                value={searchTerm}
                onChange={handleSearch}
            />
            <div className="loan-list">
                <h2 className="text-2xl font-bold mb-2">Mostrando empréstimos do usuário:</h2>
                <p className="mb-4">{props.isAdmin ? "Todos os dados do usuário" : "Aqui os seus empréstimos"}</p>
                <ul>
                    {results.map((result) => (
                        <li key={result.emprestimo_id} className="mb-4 p-4 bg-gray-100 rounded-md shadow text-gray-600">
                            <p>Usuário: {result.usuario_nome}</p>
                            <p>ID do empréstimo: {result.emprestimo_id}</p>
                            <p>Data do Empréstimo: {result.data_emprestimo}</p>
                            <p>Data de Devolução: {result.data_devolucao}</p>
                            <p>Status: {result.devolvido ? "Devolvido" : "Não devolvido"}</p>
                            {props.isAdmin && (
                                <div className="mt-2 flex justify-center items-center">
                                    
                                    <Link
                                        to={`/emprestimo/${result.emprestimo_id}`}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Editar Empréstimo
                                    </Link>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default LoanList;
