import {Routes, Route} from 'react-router'
import { ProtectedRoute } from './protected-route'
import { Layout } from '../components/Layout'
import { Home } from '../pages/home'
import { Register } from '../pages/register'
import { Login } from '../pages/login'
import { Books } from '../pages/books'
import { BookDetails } from '../pages/book-details'
import { CartPage } from '../pages/cart-page'
import { LivrosComprados } from '../pages/livros-comprados'

export const Routers = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<CartPage/>} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="/livros-comprados" element={<LivrosComprados/>} />
                </Route>
            </Route>
            
            
        </Routes>
    )
}