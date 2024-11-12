// Navbar.jsx
import { Link } from "react-router-dom";
import bookLibrary from '../images/book-library-with-open-textbook.jpg';
import { FaUserAlt } from "react-icons/fa";

function Navbar() {
	return (
		<nav 
			className="navbar p-4 flex justify-between items-start"
			style={{
				backgroundImage: `linear-gradient(to bottom, black, transparent), url(${bookLibrary})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				height: '20vh'
			}}
		>
			<h1 className="text-7xl text-right">Libra<span className="text-amber-700">NET</span></h1>
			<ul className="flex items-center space-x-4">
				<li className="bg-black bg-opacity-50 px-4 py-2 rounded-lg border-2 border-white hover:opacity-80">
					<a href="#" className="text-amber-600 font-semibold text-2xl">Pesquisar Empréstimos</a>
				</li>
				<li className="bg-black bg-opacity-50 px-4 py-2 font-semibold text-2xl rounded-lg border-2 border-white hover:opacity-80">
					<Link to={`/livros/`} className="text-amber-600">Pesquisar Livros</Link>
				</li>
				<li className="bg-black bg-opacity-50 p-2 rounded-lg border-2 border-amber-600 hover:opacity-80">
					<Link to="/login" className="hover:opacity-80 hover:cursor-pointer p-2 rounded-lg flex items-center justify-center">
						<FaUserAlt size={22} color="white" />
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
