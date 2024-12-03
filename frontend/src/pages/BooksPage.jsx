import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "motion/react";

// const MotionLink = motion.custom(Link)


export default function BookPage() {
	const MotionLink = motion(Link)

	
	const [results, setResults] = useState([]); // Todos os livros
	const [filteredResults, setFilteredResults] = useState([]); // Livros filtrados para exibição
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [bibliotecas, setBibliotecas] = useState([]); // Estado para armazenar as bibliotecas
	const [selectedBiblioteca, setSelectedBiblioteca] = useState(""); // Estado para armazenar a biblioteca selecionada
	const [selectedCategoria, setSelectedCategoria] = useState(""); // Estado para armazenar a categoria selecionada
	const [isAdmin, setIsAdmin] = useState(false); // Estado para armazenar se o usuário é admin ou não
	const categorias = [
		"Ação",
		"Fantasia",
		"Ficção Científica",
		"Romance",
		"Terror",
	]; // Adicione suas categorias aqui

	// Função para buscar todos os livros e bibliotecas disponíveis no back-end
	useEffect(() => {
		// Verifique se o usuário é admin ao carregar a página
		const user = localStorage.getItem("user");
		if (user) {
			const userData = JSON.parse(user);
			console.log("----USER DATA------", userData.admin)
			setIsAdmin(userData.admin); // Defina se o usuário é admin com base nos dados do localStorage
			
		}

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
				console.log("Livros recebidos:", data); // Debugging: Verifique os dados recebidos
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

	// Função de filtragem
	const filterResults = (livros) => {
		return livros.filter((livro) => {
			const matchesName = livro.titulo
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesBiblioteca = selectedBiblioteca
				? livro.biblioteca_nome === selectedBiblioteca
				: true; // Se nenhuma biblioteca está selecionada, inclui todos
			const matchesCategoria = selectedCategoria
				? livro.categoria === selectedCategoria
				: true; // Se nenhuma categoria está selecionada, inclui todos

			return matchesName && matchesBiblioteca && matchesCategoria;
		});
	};

	// Efeito para atualizar resultados filtrados sempre que o estado mudar
	useEffect(() => {
		const updatedFilteredResults = filterResults(results);
		setFilteredResults(updatedFilteredResults);
		console.log("Resultados filtrados atualizados:", updatedFilteredResults); // Debugging: Verifique os resultados filtrados
	}, [searchTerm, selectedBiblioteca, selectedCategoria, results]);

	const handleSearch = (event) => {
		const name = event.target.value;
		setSearchTerm(name);
	};

	const handleBibliotecaSelection = (bibliotecaId) => {
		setSelectedBiblioteca(bibliotecaId);
	};

	const handleCategoriaSelection = (categoria) => {
		setSelectedCategoria(categoria);
	};

	return (
		<div className="flex-auto w-full m-0 bg-gradient-to-b from-light-orange to-white bg-cover bg-center min-h-[92vh]">
			<Navbar />
			<section className="flex flex-col justify-center w-[90vW] m-auto mb-0 text-black min-h-[92vh]">
				<div className="flex flex-col self-center">
					<h3 className="text-3xl self-center font-bold p-2 py-5 justify-self-center">Listando Livros:</h3>
					<input
						className="w-full  p-2 mb-4 border self-center border-gray-300 rounded-md shadow-sm focus:ring text-white focus:ring-blue-500"
						type="text"
						placeholder="Pesquisar por nome do livro"
						value={searchTerm}
						onChange={handleSearch}
				/>



				</div>
				

				<div className="flex-auto m-auto">
					<div className="flex justify-center align-top"> {/* Flex para colocar as seções lado a lado */}
						{/* Seção de Filtrar por Biblioteca */}
						<div className="m-4">
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

						{/* Seção de Filtrar por Categoria */}
					
					
					<div className="flex justify-center align-top m-4">

						<div className="">
								<h4 className="">Filtrar por Categoria:</h4>
								<div>
									<label>
									<input
										type="radio"
										name="categoria"
										value=""
										checked={selectedCategoria === ""}
										onChange={() => handleCategoriaSelection("")}
										className="mr-2"
									/>
									Todas
									</label>
									{categorias.map((categoria) => (
									<div key={categoria} className="flex items-center mb-2">
										<input
										type="radio"
										id={`categoria-${categoria}`}
										name="categoria"
										value={categoria}
										onChange={() => handleCategoriaSelection(categoria)}
										checked={selectedCategoria === categoria}
										className="mr-2"
										/>
										<label htmlFor={`categoria-${categoria}`}>{categoria}</label>
									</div>
									))}
								</div>
							</div>


						</div>
						
					</div>
				</div>
					
				<div className="w-full justify-self-center">
    		

			{/* Verificar se há resultados */}
			{filteredResults.length > 0 ? (
				<>
				<h2 className="text-2xl font-bold mb-0 justify-self-center">Lista de livros:</h2>
				<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full mx-auto p-6">
					{filteredResults.map((result) => (
						<li
							key={result.id}
							className="mt-4 p-4 bg-gray-100 rounded-md shadow text-gray-600 h-fit min-w-fit"
						>
							{result && (
								<>
									<p className="font-bold text-2xl justify-self-center self-center mb-1">
										{result.titulo}
									</p>
									<p className="font-semibold text-lg mb-1 justify-self-center">
										Autor: {result.autor}
									</p>
									<p className="text-sm text-gray-500 justify-self-center">
										Categoria: <span className="font-semibold">{result.categoria}</span>
									</p>
									<p className="text-sm text-gray-500 justify-self-center">
										Ano de publicação: {result.ano_publicado}
									</p>
									<p className="text-sm text-gray-500 justify-self-center">
										Disponível: {result.disponivel ? "Sim" : "Não"}
									</p>
									<p className="text-sm my-1 text-gray-500 justify-self-center">
										Exemplares: {result.quantidade_exemplares}
									</p>
									<img
										className="justify-self-center"
										src={result.imagem_capa}
										alt={`Capa do livro ${result.titulo}`}
									/>
									{/* <p className="font-semibold text-lg justify-self-center">
										<strong>Biblioteca:</strong> {result.biblioteca_nome}
									</p> */}
									<div className="mt-2 flex justify-center items-center">
										{isAdmin && (
											<MotionLink
												whileHover={{ scale: 1.1 }}
												to={`/livros/${result.id}`}
												className="button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
											>
												Editar Livro
											</MotionLink>
										)}
									</div>
								</>
							)}
						</li>
					))}
				</ul>
				
				
				
				
				</>
			) : (
				<h1 className="text-center text-2xl font-bold text-gray-600 mt-12">
					Livro não encontrado
				</h1>
			)}
		</div>

				<div className="p-4"></div>
			</section>
		</div>
	);
}
