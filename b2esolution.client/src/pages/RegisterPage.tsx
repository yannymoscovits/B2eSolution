// src/pages/RegisterPage.tsx
import { useState } from 'react'
import { createUsuario } from '../api'
import '../styles/login.css'

export default function RegisterPage() {
    const [login, setLogin] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmar, setConfirmar] = useState('')
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
    const [mostrar, setMostrar] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setMsg(null)

        if (!login.trim() || !senha.trim() || !confirmar.trim()) {
            setMsg({ type: 'err', text: 'Preencha login, senha e confirmação.' })
            return
        }
        if (senha.length < 6) {
            setMsg({ type: 'err', text: 'A senha deve ter pelo menos 6 caracteres.' })
            return
        }
        if (senha !== confirmar) {
            setMsg({ type: 'err', text: 'As senhas não conferem.' })
            return
        }

        setLoading(true)
        try {
            await createUsuario({ login, senha })
            setMsg({ type: 'ok', text: 'Usuário criado com sucesso! Você já pode fazer login.' })
            setLogin(''); setSenha(''); setConfirmar('')
        } catch (err: any) {
            setMsg({ type: 'err', text: err?.message ?? 'Falha ao criar usuário.' })
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
                    <img src="/img/logo.png" alt="Logo" className="login-logo" />
                    <h1>{"Crie sua conta"}</h1>

                    <div className="box">
                        <h2>{"Cadastro"}</h2>

                        <form className="form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="login"
                                id="reg-login"
                                placeholder="usuário"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                autoComplete="username"
                            />

                            <div style={{ position: 'relative' }}>
                                <input
                                    type={mostrar ? 'text' : 'password'}
                                    name="senha"
                                    id="reg-senha"
                                    placeholder="senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrar(v => !v)}
                                    style={{
                                        position: 'absolute', right: 8, top: 8,
                                        padding: '6px 10px', borderRadius: 8,
                                        border: '1px solid var(--border)',
                                        background: 'var(--input-bg)', color: 'var(--text)'
                                    }}
                                >
                                    {mostrar ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>

                            <input
                                type={mostrar ? 'text' : 'password'}
                                name="confirmar"
                                id="reg-confirmar"
                                placeholder="confirmar senha"
                                value={confirmar}
                                onChange={(e) => setConfirmar(e.target.value)}
                                autoComplete="new-password"
                            />

                            <button type="submit" disabled={loading}>
                                {loading ? 'Criando...' : 'Criar conta'}
                            </button>
                        </form>

                        {msg && (
                            <p className={msg.type === 'ok' ? 'alert-success' : 'alert-error'} style={{ marginTop: 8 }}>
                                {msg.text}
                            </p>
                        )}
                      
                        <a href="/login" className="muted-link">
                            <p>{"Já tem conta? Fazer login"}</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
