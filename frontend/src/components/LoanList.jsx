import React, { useState } from "react";

function LoanList(props) {

    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async (event) => {
        const name = event.target.value
        setSearchTerm(name)
        setIsLoading(true)

        if(name.length > 0 ){
            try {
                const response = await fetch (`http://127.0.0.1:5000/api/usuarios/emprestimos/nome/${name}`)
                if (response.ok){
                    const data = await response.json()
                    setResults(data)
                    console.log(results.data)
                } else {
                    console.log("Erro ao buscar dados.")
                }
            } catch (error) {
                console.log("Erro ao fazer a requisição", error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        } else {
            setResults([])
            setIsLoading(false)
        }
    }

    const handleDevolucao = async(emprestimoId) => {
        try {
            await fetch(`http://127.0.0.1:5000/api/emprestimos/${emprestimoId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ devolvido:true }),
            })
            
        
            const updatedResults = results.map((emp) =>
                emp.emprestimo_id === emprestimoId
                    ? { ...emp, devolvido: true }
                    : emp
            );

            console.log("Resultados atualizados:", updatedResults);
            setResults(updatedResults);
        }
        catch (error) {
            console.error("Erro ao marcar devolução: ", error)
        }
    }

    return(
        <>
            <input
                className="search-field"
                type="text"
                placeholder="Pesquisar por nome do usuário"
                value={searchTerm}
                onChange={handleSearch}
            />
            <div className="loan-list">
            <h2> Mostrando empréstimos do usuário: </h2>
            <p>{props.isAdmin ? "Todos os dados do usuário" : "Aqui os seus empréstimos"}</p>
            <div className="loan-list">
                <ul>
                    {results.map((result) => (
                       <li key={result.emprestimo_id}>
                            <p>Usuário: {result.usuario_nome} </p>
                            <p>ID do empréstimo: {result.emprestimo_id}</p>
                            <p>Data do Empréstimo: {result.data_emprestimo}</p>
                            <p>Data de Devolução: {result.data_devolucao}</p>
                            <p>Status: {result.devolvido ? "Devolvido" : "Não devolvido"}</p>
                            {console.log(result.devolvido)}
                            {props.isAdmin && (
                            <div>
                                <button onClick={() => handleDevolucao(result.emprestimo_id)}>
                                    Devolver Livro
                                </button>
                                <button onClick={() => console.log("Pagar Multa")}>
                                    Pagar Multa
                                </button>
                            </div>
                

                )}

                        </li> 
                    ))}
                
                </ul>
            </div>
        </div>

        </>
        
    )


}

export default LoanList;

{/* export default LoanList

// import React from 'react';
// import '../styles/FineManagement.css';
// import LoanCard from './LoanCard';

// function FineManagement(results, isAdmin, onMarkReturned, onMarkPaid) {
//   return (
//     <div className="fine-management">
//       <h2>Gerenciamento de Multas</h2>
//       <LoanCard
//       key={loan.emprestimo_id}
//       loan={loan}
//       isAdmin={isAdmin}
//       onMarkReturned={onMarkReturned}
//       onMarkPaid={onMarkPaid}
//       />
//     </div>
//   );
// }

// export default FineManagement; */}
