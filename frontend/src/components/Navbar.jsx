import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {

    return(
        <>
            <nav className='navbar'>
                <h1>LibraNET</h1>
                <ul>
                <li>
                    <Link
                        to={`/pesquisar_emprestimo/`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    > Pesquisar Empréstimo

                    </Link>
                </li>
                <li>
                    <Link
                        to={`/livros/`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    > Pesquisar Livros
                        
                    </Link>
                </li>   
                <li>
                    <Link
                        to={`/sobre/`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    > Sobre

                    </Link>
                </li>
                </ul>
                
            </nav>
        </>
    )

}
export default Navbar