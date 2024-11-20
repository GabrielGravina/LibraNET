// Navbar.jsx
import { Link } from "react-router-dom";
import bookLibrary from '../images/book-library-with-open-textbook.jpg';
import { FaUserAlt } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";


function Navbar() {
	return (
		<nav 
			className="navbar bg-gradient-to-b from-[white] to-white flex justify-around items-center w-full m-auto min-h-[8vh] max-h-[8vh]"
		>
			
			<ul className="flex items-center space-x-4 text-black m-auto">

			<li className="p-1  hover:opacity-80">
					<Link to="/login" className="hover:opacity-80 hover:cursor-pointer p-1  flex items-center justify-center">
						<FaUserAlt className="mr-4" size={22} color="black" /><p className="font-semibold text-lg">Minha conta</p>
					</Link>
				</li>
				<li className="px-4 py-1 font-semibold text-lg    hover:opacity-80">
					<Link to={`/livros/`} className=" flex items-center">
						<IoBookSharp className="m-2" size={22} />
						Buscar Livros
					</Link>
				</li>

				
				<li className="px-4 py-2 hover:opacity-80">
					<Link to={`/emprestimos`} className="font-semibold text-lg flex items-center space-x-2">
						<FaSearch size={20} />
						<span>Buscar Empréstimos</span>
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
