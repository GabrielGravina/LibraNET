import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import BooksPage from "./pages/BooksPage";
import EditBookPage from "./pages/EditBookPage";
import EditLoanPage from "./pages/EditLoanPage";
import HomePage from "./pages/HomePage";
import LoanPage from "./pages/LoanPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import LoansPage from "./pages/LoansPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
		errorElement: <NotFoundPage />,
	},
	{
		path: "/profiles",
		element: <EditLoanPage />,
	},
	{
		path: "/emprestimo/:emprestimoId",
		element: <LoanPage />,
	},
	{
		path: "/livros",
		element: <BooksPage />,
	},
	{
		path: "/livros/:livro_id",
		element: <EditBookPage />,
	},
	{
		path: "/login",
		element: <LoginPage />
	},
	{
		path: "/emprestimos",
		element: <LoansPage />
	}
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
