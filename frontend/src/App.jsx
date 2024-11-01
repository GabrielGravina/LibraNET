import { useState } from 'react';
import Navbar from './components/Navbar';
import FineManagement from './components/FineManagement';
import UserSearchBar from './components/UserSearchBar';
import LoginControl from './components/LoginControl'
import LoanList from './components/LoanList';
import './App.css';
import SearchBar from './components/SearchBar';

function App() {
  // Estado para simular o tipo de usuário. true representa um admin.
  const [isAdmin, setIsAdmin] = useState(false); // Ajuste para true se quiser testar como admin
  
  
  const toggleAdmin = () => {
    setIsAdmin(!isAdmin)
  }

  return (
    <>
      <Navbar />

      <LoginControl isAdmin={isAdmin} toggleAdmin={toggleAdmin} />
      <LoanList
        isAdmin={isAdmin}
      />
      <SearchBar />
      {console.log(isAdmin)}
    </>
  );
}

export default App;
