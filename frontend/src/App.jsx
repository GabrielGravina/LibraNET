import { useState } from 'react';
import Navbar from './components/Navbar';
import FineManagement from './components/FineManagement';
import UserSearchBar from './components/UserSearchBar';
import './App.css';

function App() {
  // Estado para simular o tipo de usuário. true representa um admin.
  const [isAdmin, setIsAdmin] = useState(false); // Ajuste para true se quiser testar como admin

  return (
    <>
      <Navbar />
      {/* Botão para simular login como admin ou usuário */}
      <button onClick={() => setIsAdmin(!isAdmin)}>
        {isAdmin ? 'Sair do modo Admin' : 'Entrar como Admin'}
      </button>
      
      {/* Lógica condicional para exibir FineManagement apenas para admin */}
      {isAdmin ? <FineManagement /> : <UserSearchBar />}
    </>
  );
}

export default App;
