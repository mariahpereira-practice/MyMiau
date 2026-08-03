import { Routes, Route } from 'react-router'
import { Layout } from '../components/Layout'
import { Home } from '../pages/home'
import { Register } from '../pages/register'
import { Login } from '../pages/login'
import { ProtectedRoute } from './protected-route'
import { Dashboard } from '../pages/dashboard'
import { Gatos } from '../pages/gatos'

export const Routers = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/gatos" element={<Gatos />} />
                </Route>
            </Route>
        </Routes>
    )
}