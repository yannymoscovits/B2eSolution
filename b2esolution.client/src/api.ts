// src/api.ts
import type { PagedResult, ProductListItem, ProductCreateDto, ProductUpdateDto } from './types'

const BASE = import.meta.env.VITE_API_BASE ?? 'https://localhost:44341/api'
const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH ?? '/Auth/login'

let _token: string | null = localStorage.getItem('token')
export const setToken = (t: string | null) => {
    _token = t
    if (t) localStorage.setItem('token', t); else localStorage.removeItem('token')
}

function extractAspNetErrorMessage(raw: any): string | null {
    if (!raw || typeof raw !== 'object') return null
    if (raw.errors && typeof raw.errors === 'object') {
        const msgs: string[] = []
        for (const [field, arr] of Object.entries(raw.errors as Record<string, any>)) {
            const list = Array.isArray(arr) ? arr : [arr]
            list.forEach(x => msgs.push(`${field}: ${String(x)}`))
        }
        if (msgs.length) return msgs.join('\n')
    }
    if (raw.title) return String(raw.title)
    if (raw.message) return String(raw.message)
    return null
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers)
    headers.set('Accept', 'application/json')
    if (!(init?.body instanceof FormData)) headers.set('Content-Type', 'application/json')
    if (_token) headers.set('Authorization', `Bearer ${_token}`)

    const res = await fetch(`${BASE}${path}`, { ...init, headers })
    const text = await res.text()
    const json = text ? (() => { try { return JSON.parse(text) } catch { return null } })() : null

    if (!res.ok) {
        const msg = extractAspNetErrorMessage(json) ?? (json ? JSON.stringify(json) : `HTTP ${res.status}`)
        throw new Error(msg)
    }
    if (res.status === 204 || !text) return undefined as unknown as T
    return (json ?? (text as unknown)) as T
}

// ===== AUTH =====
export async function login(login: string, senha: string) {
    const data = await request<{ token: string }>(LOGIN_PATH, {
        method: 'POST',
        body: JSON.stringify({ login, senha }),
    })
    setToken(data.token)
    return data
}

// ===== PRODUTOS =====
function normalizePaged(raw: any): PagedResult<ProductListItem> {
    if (raw && Array.isArray(raw.items)) {
        return { items: raw.items, page: Number(raw.page ?? 1), pageSize: Number(raw.pageSize ?? raw.items.length ?? 0), total: Number(raw.total ?? raw.items.length ?? 0) }
    }
    if (raw && Array.isArray(raw.itens)) {
        return { items: raw.itens, page: Number(raw.pagina ?? 1), pageSize: Number(raw.tamanho ?? raw.itens.length ?? 0), total: Number(raw.total ?? raw.itens.length ?? 0) }
    }
    if (Array.isArray(raw)) {
        return { items: raw, page: 1, pageSize: raw.length, total: raw.length }
    }
    const k = Object.keys(raw ?? {}).find(x => Array.isArray((raw as any)[x]))
    if (k) {
        const arr = (raw as any)[k]
        return { items: arr, page: Number(raw.page ?? 1), pageSize: Number(raw.pageSize ?? arr.length ?? 0), total: Number(raw.total ?? arr.length ?? 0) }
    }
    throw new Error('Formato inesperado do retorno de produtos.')
}

export async function listProdutos(params?: { pagina?: number; tamanho?: number; ordem?: 'asc' | 'desc' }) {
    const pagina = params?.pagina ?? 1
    const tamanho = params?.tamanho ?? 10
    const ordem = params?.ordem ?? 'asc'
    const qs = new URLSearchParams({ pagina: String(pagina), tamanho: String(tamanho), ordem })
    const raw = await request<any>(`/produtos?${qs.toString()}`)
    return normalizePaged(raw)
}

function toNumberPt(v: any) {
    const n = typeof v === 'string' ? Number(v.replace(',', '.')) : Number(v)
    return Number.isFinite(n) ? n : 0
}

// Troque estas duas funções:
export function createProduto(dto: any) {
    const body = {
        nome: dto?.nome ?? dto?.name ?? dto?.productName ?? '',
        valor: toNumberPt(dto?.valor ?? dto?.preco ?? dto?.price ?? dto?.Value),
    }
    return request<number | { id: number }>(`/produtos`, { method: 'POST', body: JSON.stringify(body) })
}

export function updateProduto(id: number, dto: any) {
    const body = {
        nome: dto?.nome ?? dto?.name ?? dto?.productName ?? '',
        valor: toNumberPt(dto?.valor ?? dto?.preco ?? dto?.price ?? dto?.Value),
    }
    return request<void>(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}
export function deleteProduto(id: number) {
    return request<void>(`/produtos/${id}`, { method: 'DELETE' })
}

// ===== ADDUSUARIOS =====

export async function createUsuario(dto: { login: string; senha: string }) {
    return request<void>(`/usuarios`, {
        method: 'POST',
        body: JSON.stringify(dto),
    })
}