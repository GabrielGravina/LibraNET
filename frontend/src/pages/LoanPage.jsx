import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LoanPage() {
    const { emprestimoId } = useParams(); // Obtém o ID do empréstimo da URL
    const [loanData, setLoanData] = useState(null); // Armazena dados do empréstimo
    const [isLoading, setIsLoading] = useState(true); // Controla o estado de carregamento
    const [error, setError] = useState(null); // Armazena erros

    // Busca os dados do empréstimo ao montar o componente
    useEffect(() => {
        const fetchLoanData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/emprestimo/${emprestimoId}`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar dados do empréstimo.");
                }
                const data = await response.json();
                setLoanData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLoanData();
    }, [emprestimoId]);

    // Atualiza os dados do empréstimo no servidor
    const handleUpdateLoan = async (event) => {
        
        const requestData = {
            ...loanData,
            data_devolucao: new Date(loanData.data_devolucao).toUTCString(), // Converte a data para o formato UTC
        };

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/emprestimo/${emprestimoId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) {
                throw new Error("Erro ao atualizar os dados do empréstimo.");
            }
            const updatedData = await response.json();
            setLoanData(updatedData); // Atualiza com dados novos
            alert("Empréstimo atualizado com sucesso!");
        } catch (error) {
            alert(error.message);
        }
    };

    // Atualiza os valores dos campos no estado
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoanData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
            multa: {
                ...prevData.multa,
                [name === "multa" ? "valor" : name]: type === "checkbox" ? checked : value
            }
        }));
    };

    if (isLoading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Editar Empréstimo</h2>

            {/* Informações do Empréstimo */}
            {loanData && (
                <div className="flex-col mb-6 p-4 bg-gray-100 rounded-md items-center">
                    <h3 className="text-gray-600 text-2xl ">Informações do Empréstimo: </h3>
                    <p className="text-gray-600 text-3xl">Nome do Usuário: {loanData.usuario_nome}</p>
                    <p className="text-gray-600"><strong>ID:</strong> {loanData.emprestimo_id}</p>
                    <p className="text-gray-600"><strong>Data do Empréstimo:</strong> {loanData.data_emprestimo}</p>
                    <p className="text-gray-600"><strong>Data de Devolução:</strong> {loanData.data_devolucao}</p>
                    <p className="text-gray-600"><strong>Devolvido:</strong> {loanData.devolvido ? 'Sim' : 'Não'}</p>
                    <p className="text-gray-600"><strong>Valor da Multa:</strong> {loanData.multa?.valor ? loanData.multa.valor : 'Nenhuma multa aplicada'}</p>
                    <p className="text-gray-600"><strong>Data de Pagamento:</strong> {loanData.multa?.data_pagamento ? loanData.multa.data_pagamento : 'Não paga'}</p>
                </div>
            )}

            {/* Formulário de Edição */}
            <form onSubmit={handleUpdateLoan} className="space-y-4">
                <h3 className="">Editar Informações</h3>
                {/* Campo para marcar devolução */}
                <div className="flex items-center justify-center">
                    <label className="mr-2">Devolvido:</label>
                    <input
                        type="checkbox"
                        name="devolvido"
                        checked={loanData.devolvido}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                </div>

                {/* Campo para editar data de devolução */}
                <div>
                    <label className="block">Data de Devolução:</label>
                    <input
                        type="date"
                        name="data_devolucao"
                        value={loanData.data_devolucao?.split("T")[0] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Campo para ajustar o valor da multa */}
                <div>
                    <label className="block">Multa:</label>
                    <input
                        type="number"
                        name="multa" // O name aqui deve ser "multa" para o estado ser atualizado corretamente
                        value={loanData.multa?.valor || 0} // Acessa o valor corretamente
                        onChange={handleChange}
                        min="0"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Botão para enviar as alterações */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Salvar Alterações
                </button>
            </form>
        </div>
    );
}
