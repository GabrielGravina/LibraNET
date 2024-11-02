import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'

import './index.css'
import HomePage from './pages/HomePage'
import LoanPage from './pages/LoanPage'
import EditLoanPage from './pages/EditLoanPage'
import NotFoundPage from './pages/NotFoundPage'
import BookPage from './pages/BookPage'

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
    path: '/livros/:livroId',
    element: <BookPage />
  }

])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
