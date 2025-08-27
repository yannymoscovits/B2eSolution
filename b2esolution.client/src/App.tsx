import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProductsPage from './pages/ProductsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
    const [hasToken, setHasToken] = useState(!!localStorage.getItem('token'))

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        hasToken
                            ? <Navigate to="/" replace />
                            : <LoginPage onLoggedIn={() => setHasToken(true)} />
                    }
                />
                <Route path="/registrar" element={<RegisterPage />} />
                <Route
                    path="/"
                    element={hasToken ? <ProductsPage /> : <Navigate to="/login" replace />}
                />
                <Route path="*" element={<Navigate to={hasToken ? "/" : "/login"} replace />} />
            </Routes>
        </BrowserRouter>
    )
}
