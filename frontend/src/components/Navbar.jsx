import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
	return (
		<>
			<nav className="navbar">
				<h1>LibraNET</h1>
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
