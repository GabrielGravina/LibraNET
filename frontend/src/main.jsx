import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'

import './index.css'
import HomePage from './pages/HomePage'
import LoanPage from './pages/LoanPage'
import EditLoanPage from './pages/EditLoanPage'
import NotFoundPage from './pages/NotFoundPage'
import EditBookPage from './pages/EditBookPage'
import BooksPage from './pages/BooksPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />
  },
  {
    path: '/profiles',
    element: <EditLoanPage />
  },
  {
    path: '/emprestimo/:emprestimoId',
    element: <LoanPage />
  },
  {
    path: '/livros',
    element: <BooksPage />
  },
  {
    path: '/livros/:livro_id',
    element: <EditBookPage />
  }

])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
