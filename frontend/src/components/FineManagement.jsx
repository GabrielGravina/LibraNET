// FineManagement.jsx
import React, { useState } from "react";

function FineManagement() {
	const [searchTerm, setSearchTerm] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);

	// Função para lidar com a busca de usuários
	const handleSearch = async (event) => {
		const name = event.target.value;
		setSearchTerm(name);
		setLoading(true);

		if (name.length > 0) {
			try {
				const response = await fetch(
					`http://127.0.0.1:5000/api/usuarios/emprestimos/nome/${name}`,
				);
				if (response.ok) {
					const data = await response.json();
					setResults(data);
				} else {
					console.error("Erro ao buscar dados");
					setResults([]);
				}
			} catch (error) {
				console.error("Erro ao fazer a requisição:", error);
				setResults([]);
			} finally {
				setLoading(false);
			}
		} else {
			setResults([]);
			setLoading(false);
		}
	};

	// Função para registrar pagamento e devolução do livro
	const handlePagamento = async (emprestimoId) => {
		try {
			await fetch(`http://127.0.0.1:5000/api/emprestimos/${emprestimoId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: "pago", multa: 0, devolvido: true }),
			});
			setResults(
				results.map((emp) =>
					emp.emprestimo_id === emprestimoId
						? { ...emp, status: "pago", multa: 0, devolvido: true }
						: emp,
				),
			);
		} catch (error) {
			console.error("Erro ao atualizar o status da multa:", error);
		}
	};

	// Função para marcar apenas como devolvido se não houver multa
	const handleDevolucao = async (emprestimoId) => {
		try {
			await fetch(`http://127.0.0.1:5000/api/emprestimos/${emprestimoId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ devolvido: true }),
			});
			setResults(
				results.map((emp) =>
					emp.emprestimo_id === emprestimoId
						? { ...emp, devolvido: true }
						: emp,
				),
			);
		} catch (error) {
			console.error("Erro ao marcar devolução:", error);
		}
	};

	return (
		<div>
			<h2>Gerenciamento de Multas</h2>
			<input
				className="search-field"
				type="text"
				placeholder="Pesquisar por nome do usuário"
				value={searchTerm}
				onChange={handleSearch}
			/>

			{loading && <p>Carregando...</p>}

			<ul>
				{results.map((result) => (
					<li key={result.emprestimo_id}>
						<p>Empréstimo ID: {result.emprestimo_id}</p>
						<p>Usuário: {result.usuario_nome}</p>
						<p>Data de Empréstimo: {result.data_emprestimo}</p>
						<p>Data de Devolução: {result.data_devolucao}</p>
						<p>Status: {result.status}</p>
						{console.log(result)}
						<p>
							Multa:{" "}
							{result.multa > 0 ? `R$ ${result.multa.toFixed(2)}` : "Sem multa"}
						</p>
						<p>Devolvido: {result.devolvido ? "Sim" : "Não"}</p>

						{/* Botões de ação */}
						{!result.devolvido && result.multa > 0 && (
							<button onClick={() => handlePagamento(result.emprestimo_id)}>
								Marcar como Pago e Devolvido
							</button>
						)}
						{!result.devolvido && result.multa === 0 && (
							<button onClick={() => handleDevolucao(result.emprestimo_id)}>
								Marcar como Devolvido
							</button>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default FineManagement;
