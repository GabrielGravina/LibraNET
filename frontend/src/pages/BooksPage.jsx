import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function BookPage() {

    const [results, setResults] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("")

    const handleSearch = async (event) => {
        const name = event.target.value
        setSearchTerm(name)
        setIsLoading(true)

        if (name.length > 0) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/livros/${name}`)
                
                if (response.ok) {
                    const data = await response.json()
                    setResults(data)
                    console.log(data)
                } else {
                    console.log("Erro ao buscar livros.")
                }   
            } catch (error) {
                console.log("Erro ao fazer requisição.", error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        } else {
            setResults([])
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h3>Listando Livros:</h3>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                type="text"
                placeholder="Pesquisar por nome do usuário"
                value={searchTerm}
                onChange={handleSearch}
            />
            <div className="loan-list">
                <h2 className="text-2xl font-bold mb-2">Lista de livros:</h2>
                {/* <p className="mb-4">{props.isAdmin ? "Todos os dados do usuário" : "Aqui os seus empréstimos"}</p> */}
                <ul>
                    {results.map((result) => (
                        <li key={result.id} className="mb-4 mt-4 p-4 bg-gray-100 rounded-md shadow text-gray-600">
                            <p>Titulo: {result.titulo}</p>
                            <p>Autor: {result.autor}</p>
                            <p>Ano de publicação: {result.ano_publicado}</p>
                            <p>Disponível: {result.disponivel ? "Sim" : "Não"}</p>
                            <p>Status: {result.devolvido ? "Devolvido" : "Não devolvido"}</p>
                            {console.log(result.livro_id)}
                            {console.log("Result:", result)}
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
    )
}