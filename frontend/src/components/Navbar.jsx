import { Link } from "react-router-dom";
import bookLibrary from '../images/book-library-with-open-textbook.jpg'
import "../styles/Navbar.css";

function Navbar() {
	return (
		<>
			<nav className="navbar p-4"
			style={{
          backgroundImage: `linear-gradient(to bottom, black, transparent), url(${bookLibrary})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '50vh'
        }}
			>
				<h1 className="text-7xl">Libra<span>NET</span></h1>
				<ul>
					<li>
						<a href="#">Pesquisar Empréstimo</a>
					</li>
					<li>
						<Link
							to={`/livros/`}
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
						>
							{" "}
							Pesquisar Livros
						</Link>
					</li>
					<li>
						<a>Sobre</a>
					</li>
				</ul>
			</nav>
		</>
	);
}
export default Navbar;
