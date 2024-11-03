import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookPage() {
    const { livro_id } = useParams();
    const [bookData, setBookData] = useState({
        titulo: "",
        autor: "",
        prateleira: "",
        ano_publicado: "",
        disponivel: false,
        status: "",
        biblioteca_id: ""
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/livros/${livro_id}`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar dados do livro.");
                }
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const livro = data[0];
                    setBookData({
                        titulo: livro.titulo || "",
                        autor: livro.autor || "",
                        prateleira: livro.prateleira || "",
                        ano_publicado: livro.ano_publicado || "",
                        disponivel: livro.disponivel || false,
                        status: livro.status || "",
                        biblioteca_id: livro.biblioteca_id || ""
                    });
                } else {
                    // Se não houver livros, mantém os valores padrões
                    setBookData({
                        titulo: "",
                        autor: "",
                        prateleira: "",
                        ano_publicado: "",
                        disponivel: false,
                        status: "",
                        biblioteca_id: ""
                    });
                }
                console.log("Dataaaa:", data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchBookData();
    }, [livro_id]);
    

    // Atualiza os dados do livro no servidor
    const handleUpdateBook = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/livros/${livro_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData)
            });
            if (!response.ok) {
                throw new Error("Erro ao atualizar os dados do livro.");
            }
            const updatedData = await response.json();
            setBookData(updatedData.livro); // Atualiza com dados novos
            alert("Livro atualizado com sucesso!");
        } catch (error) {
            alert(error.message);
        }
    };

    // Atualiza os valores dos campos no estado
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBookData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    if (isLoading) return <p>Carregando dados do livro...</p>;
    if (error) return <p>{error}</p>;
   
    return (
        <div>
            {/* Informações do Livro */}
            {bookData && console.log(bookData) && (
                
                <div className="flex-col mb-6 p-4 bg-gray-100 rounded-md items-center">
                    <h3>Conteúdos do livro:</h3>
                    <p className="text-gray-600 text-3xl">Título: {bookData.titulo}</p>
                    <p className="text-gray-600"><strong>Autor:</strong> {bookData.autor}</p>
                    <p className="text-gray-600"><strong>Ano de publicação:</strong> {bookData.ano_publicado}</p>
                    <p className="text-gray-600"><strong>Prateleira:</strong> {bookData.prateleira}</p>
                    <p className="text-gray-600"><strong>Disponível:</strong> {bookData.disponivel}</p>
                    <p className="text-gray-600"><strong>Status:</strong> {bookData.status}</p>
                    <p className="text-gray-600"><strong>Biblioteca:</strong> {bookData.biblioteca_id}</p>
                </div>
            )}
            
            
            <form onSubmit={handleUpdateBook}>
                <label>
                    Título:
                    <input
                        type="text"
                        name="titulo"
                        value={bookData.titulo}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Autor:
                    <input
                        type="text"
                        name="autor"
                        value={bookData.autor}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Prateleira:
                    <input
                        type="text"
                        name="prateleira"
                        value={bookData.prateleira}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Ano Publicado:
                    <input
                        type="text"
                        name="ano_publicado"
                        value={bookData.ano_publicado}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Disponível:
                    <input
                        type="checkbox"
                        name="disponivel"
                        checked={bookData.disponivel}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Status:
                    <input
                        type="text"
                        name="status"
                        value={bookData.status}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Biblioteca ID:
                    <input
                        type="number"
                        name="biblioteca_id"
                        value={bookData.biblioteca_id}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Atualizar Livro</button>
            </form>
        </div>
    );
}
