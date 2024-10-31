import React, { useState } from 'react';
import '../styles/UserSearchBar.css'

function UserSearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para lidar com a busca
  const handleSearch = async (event) => {
    const name = event.target.value;
    setSearchTerm(name);
    setLoading(true);

    if (name.length > 0) {
      try {
        // Faz uma requisição GET para o backend
        const response = await fetch(`http://127.0.0.1:5000/api/usuarios/emprestimos/nome/${name}`);
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setResults(data);
        } else {
          console.error('Erro ao buscar dados');
          setResults([]);
        }
      } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);  // Limpa os resultados se a barra estiver vazia
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        className="search-field"
        type="text"
        placeholder="Pesquisar por nome do usuário"
        value={searchTerm}
        onChange={handleSearch}
      />
      
      {loading && <p>Carregando...</p>}
      {/* "livro_id": self.livro_id,
            "usuario_id": self.usuario_id,
            "data_emprestimo": self.data_emprestimo,
            "data_devolucao": self.data_devolucao */}
      
        {results.map((result) => (
          <ul className='loan-list' key={result.emprestimo_id}>
            <li className='loan-id'>Empréstimo ID: {result.emprestimo_id}</li>
            <li className='loan-user'>Usuário: {result.usuario_nome}</li>
            <li className='loan-date'>Data: {result.data_emprestimo}</li>
            <li className='loan-return-date'>Data de devolução: {result.data_devolucao}</li>
          </ul>
        ))}
      
    </div>
  );
}

export default UserSearchBar;