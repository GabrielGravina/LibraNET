import '../styles/Navbar.css'

function Navbar() {

    return(
        <>
            <nav className='navbar'>
                <h1>LibraNET</h1>
                <ul>
                <li><a>Pesquisar Empréstimo</a></li>
                <li><a>Pesquisar Livros</a></li>
                <li><a>Sobre</a></li>    
                </ul>
                
            </nav>
        </>
    )

}
export default Navbar