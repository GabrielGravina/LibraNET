// Navbar.jsx
import { Link } from "react-router-dom";
import bookLibrary from '../images/book-library-with-open-textbook.jpg';
import { FaUserAlt } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";
import LibraLogo from '../images/LibranetLogo.png';

function Navbar() {
	return (
		<nav 
			className="navbar p-1 flex justify-between items-start w-11/12 m-auto max-h-[10vh]"
		>
			
			<img src={LibraLogo} className="max-w-10" alt="Libra Logo" />
			<ul className="flex items-center space-x-4">
			<li className="bg-black bg-opacity-50 px-4 py-2 rounded-lg border-y-2 border-orange hover:opacity-80">
				<Link to={`/emprestimos`} className="text-white font-semibold text-lg">Buscar Empréstimos</Link>
			</li>

				<li className="bg-black bg-opacity-50 px-4 py-1 font-semibold text-lg rounded-lg border-y-2  border-orange hover:opacity-80">
					<Link to={`/livros/`} className="text-white flex items-center">
						<IoBookSharp className="m-2" size={22} />
						Buscar Livros
					</Link>
				</li>

				<li className="bg-black bg-opacity-50 p-1 rounded-lg border-orange border-y-2 border-hardtext-white hover:opacity-80">
					<Link to="/login" className="hover:opacity-80 hover:cursor-pointer p-1 rounded-lg flex items-center justify-center">
						<FaUserAlt className="mr-4" size={22} color="white" /><p className="text-white font-semibold text-lg">Minha conta</p>
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
