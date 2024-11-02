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
        event.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/emprestimo/${emprestimoId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loanData),
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
            [name]: type === "checkbox" ? checked : value
        }));
    };

    if (isLoading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Editar Empréstimo</h2>

            {/* Informações do Empréstimo */}
            {loanData && (
                <div>
                    <h3>Informações do Empréstimo</h3>
                    <p><strong>ID:</strong> {loanData.emprestimo_id}</p>
                    <p><strong>Nome do Usuário:</strong> {loanData.usuario_nome}</p>
                    <p><strong>Data do Empréstimo:</strong> {loanData.data_emprestimo}</p>
                    <p><strong>Data de Devolução:</strong> {loanData.data_devolucao}</p>
                    <p><strong>Devolvido:</strong> {loanData.devolvido ? 'Sim' : 'Não'}</p>
                    <h3>Editar Informações</h3>
                </div>
            )}

            <form onSubmit={handleUpdateLoan}>
                {/* Campo para marcar devolução */}
                <label>
                    Devolvido:
                    <input
                        type="checkbox"
                        name="devolvido"
                        checked={loanData.devolvido}
                        onChange={handleChange}
                    />
                </label>

                {/* Campo para editar data de devolução */}
                <label>
                    Data de Devolução:
                    <input
                        type="date"
                        name="data_devolucao"
                        value={loanData.data_devolucao?.split("T")[0] || ""}
                        onChange={handleChange}
                    />
                </label>

                {/* Campo para ajustar o valor da multa */}
                <label>
                    Multa:
                    <input
                        type="number"
                        name="multa"
                        value={loanData.multa || 0}
                        onChange={handleChange}
                        min="0"
                    />
                </label>

                {/* Botão para enviar as alterações */}
                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
}
