import { useState } from 'react'
import { login as loginApi } from '../api'
import '../styles/login.css'
import { Link } from 'react-router-dom'

export default function LoginPage({ onLoggedIn }: { onLoggedIn: () => void }) {
    const [login, setLogin] = useState('')
    const [senha, setSenha] = useState('')
    const [loading, setLoading] = useState(false)


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!login.trim() || !senha.trim()) {
            alert('Informe login e senha.')
            return
        }
        setLoading(true)
        try {
            await loginApi(login, senha)
            onLoggedIn()
        } catch (err: any) {
            alert(err?.message ?? 'Falha no login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div id="container" className="login-container">
           
            <div className="image-side">
                <img src="/img/fundo.jpg" alt="Imagem destaque" className="side-image" />
            </div>

        
            <div className="login-side">
                <div className="box-login">
                    <img src="/img/logo.png" alt="Logo B2e" className="login-logo" />

                    <h1>
                      
                        {'Bem-vindo(a) novamente.'}
                    </h1>

                    <div className="box">
                        <h2>{'Login'}</h2>

                        <form className="form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="login"
                                id="username"
                                placeholder="usu\u00e1rio"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                autoComplete="username"
                            />

                            <input
                                type="password"
                                name="senha"
                                id="password"
                                placeholder="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                autoComplete="current-password"
                            />

                            <button type="submit" disabled={loading}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>

                        <Link to="/registrar" className="muted-link">
                            <p>{'Criar uma conta'}</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
