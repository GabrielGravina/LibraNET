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
				const response = await fetch(
					`http://127.0.0.1:5000/api/usuarios/emprestimos/nome/${name}`,
				);
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
				emp.emprestimo_id === emprestimoId ? { ...emp, devolvido: true } : emp,
			);

			console.log("Resultados atualizados:", updatedResults);
			setResults(updatedResults);
		} catch (error) {
			console.error("Erro ao marcar devolução: ", error);
		}
	};

	return (
		<div className="flex-auto w-full m-auto bg-gradient-to-b from-light-orange to-white bg-cover bg-center">
			{/* Campo de pesquisa */}
			<div className="mb-6">
				<input
					className="w-96 p-3 mb-4 border-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
					type="text"
					placeholder="Pesquisar por nome do usuário"
					value={searchTerm}
					onChange={handleSearch}
				/>
			</div>

			{/* Lista de Empréstimos */}
			<div className="loan-list">
				<h2 className="text-4xl font-semibold mb-2 text-amber-600">
					Mostrando empréstimos do usuário:
				</h2>
				<p className="mb-4 text-white">
					{props.isAdmin
						? "Todos os dados dos empréstimos"
						: "Empréstimos:"}
				</p>
				<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-4/5 mx-auto p-12">
					{results.map((result) => (
						<li
							key={result.emprestimo_id}
							className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition duration-300"
						>
							<p className="font-medium text-lg text-gray-800">Usuário: {result.usuario_nome}</p>
							<p className="text-sm text-gray-600">ID do empréstimo: {result.emprestimo_id}</p>
							<p className="text-sm text-gray-600">Data do Empréstimo: {result.data_emprestimo}</p>
							<p className="text-sm text-gray-600">Data de Devolução: {result.data_devolucao}</p>
							<p
								className={`text-sm font-semibold ${result.devolvido ? 'text-green-500' : 'text-red-500'}`}
							>
								Status: {result.devolvido ? "Devolvido" : "Não devolvido"}
							</p>
							{/* Mostrar botão editar apenas para admins */}
							{props.isAdmin && (
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
