import { useEffect, useState, useCallback, useMemo } from 'react'
import { listProdutos, deleteProduto, createProduto, updateProduto, setToken } from '../api'
import type { ProductListItem, ProductCreateDto, ProductUpdateDto } from '../types'
import Modal from '../components/ProductModal'
import ProductForm from '../components/ProductForm'
import Confirm from '../components/ConfirmDialog'
import '../styles/product.css'
function getId(p: any): number {
    return Number(p?.id ?? p?.idProduto ?? p?.produtoId ?? p?.Id ?? 0)
}
function getName(p: any): string {
    return String(p?.name ?? p?.nome ?? p?.productName ?? p?.Name ?? '—')
}
function getPrice(p: any): number {
    const raw = p?.price ?? p?.valor ?? p?.preco ?? p?.Price ?? p?.Valor ?? 0
    const n = typeof raw === 'string' ? Number(raw.replace(',', '.')) : Number(raw)
    return Number.isFinite(n) ? n : 0
}

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export default function ProductsPage() {
    const [allItems, setAllItems] = useState<ProductListItem[]>([])
    const [pagina, setPagina] = useState(1)
    const [ordem, setOrdem] = useState<'asc' | 'desc'>('asc')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [openForm, setOpenForm] = useState(false)
    const [editing, setEditing] = useState<ProductListItem | null>(null)
    const [openConfirm, setOpenConfirm] = useState<{ open: boolean; id?: number }>({ open: false })
    const PAGE_SIZE = 8

    async function loadAll() {
        setLoading(true)
        setError(null)
        try {
            const all: ProductListItem[] = []
            let page = 1
            let total = Infinity

            while (all.length < total) {
                const res = await listProdutos({ pagina: page, tamanho: PAGE_SIZE })
                const batch = Array.isArray((res as any)?.items) ? (res as any).items : []
                all.push(...batch)
                total = Number((res as any)?.total ?? all.length)
                if (batch.length === 0) break
                page++
            }

            setAllItems(all)
        } catch (err: any) {
            setError(err?.message ?? 'Falha ao carregar')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadAll() }, [])
    function handleLogout() {
        setToken(null)
        window.location.reload()
    }

    async function handleSave(payload: ProductCreateDto | ProductUpdateDto, id?: number) {
        try {
            if (id) await updateProduto(id, payload as ProductUpdateDto)
            else await createProduto(payload as ProductCreateDto)
            setOpenForm(false)
            setEditing(null)
            await loadAll()
        } catch (e: any) {
            alert(e?.message ?? 'Erro ao salvar')
        }
    }

    async function handleDelete(id: number) {
        try {
            await deleteProduto(id)
            setOpenConfirm({ open: false })
            await loadAll()
        } catch (e: any) {
            alert(e?.message ?? 'Erro ao excluir')
        }
    }

    const collator = useMemo(() => new Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true }), [])
    const sortedAll = useMemo(() => {
        const arr = [...allItems]
        arr.sort((a, b) => {
            const cmp = collator.compare(getName(a), getName(b))
            return ordem === 'asc' ? cmp : -cmp
        })
        return arr
    }, [allItems, ordem, collator])

    const totalItems = sortedAll.length
    const maxPage = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
    const currentPage = Math.min(pagina, maxPage)
    const start = (currentPage - 1) * PAGE_SIZE
    const pageItems = sortedAll.slice(start, start + PAGE_SIZE)

    const canPrev = currentPage > 1 && !loading
    const canNext = currentPage < maxPage && !loading

    function toggleSortByName() {
        setOrdem(o => (o === 'asc' ? 'desc' : 'asc'))
        setPagina(1)
    }

    const exportAllCsv = useCallback(() => {
        const header = ['Nome produto', 'Valor (R$)']
        const rows = sortedAll.map(p => [getName(p), getPrice(p).toFixed(2)])
        const csv = [header, ...rows]
            .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'))
            .join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'produtos.csv'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }, [sortedAll])

    return (
        <div className="page products">
            <header className="topbar products-topbar">
                <div className="title">Produtos</div>
                <div className="spacer" />
                <button type="button" className="ghost download-btn" onClick={exportAllCsv} disabled={loading || sortedAll.length === 0}>
                    Download (.csv)
                </button>
                <button className="primary" onClick={() => { setEditing(null); setOpenForm(true) }}>+ Novo</button>
                <button className="ghost" onClick={handleLogout}>Sair</button>
            </header>

            <section className="card products-card">
                <div className="table-wrapper">
                    <table className="table">
                        <thead className="sticky">
                            <tr>
                                <th onClick={toggleSortByName} style={{ cursor: 'pointer' }}>
                                    Nome Produto {ordem === 'asc' ? '▲' : '▼'}
                                </th>
                                <th style={{ width: 180 }}>Valor (R$)</th>
                                <th style={{ width: 140, textAlign: 'right' }}>Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan={3}>Carregando...</td></tr>
                            )}
                            {!loading && error && (
                                <tr><td colSpan={3} style={{ color: 'var(--danger)' }}>{error}</td></tr>
                            )}
                            {!loading && !error && pageItems.length === 0 && (
                                <tr><td colSpan={3} className="muted">Nenhum produto encontrado.</td></tr>
                            )}

                            {!loading && !error && pageItems.map(p => {
                                const id = getId(p)
                                return (
                                    <tr
                                        key={id || getName(p)}
                                        onClick={() => { setEditing(p as any); setOpenForm(true) }}
                                        className="row-hover"
                                        title="Clique para editar"
                                    >
                                        <td>{getName(p)}</td>
                                        <td>{money.format(getPrice(p))}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button style={{ background: 'rgb(105 25 25)' }} className="danger"
                                                onClick={(e) => { e.stopPropagation(); setOpenConfirm({ open: true, id }) }}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="pager">
                    <button className="ghost pager-btn prev" style={{ marginRight: '10px;' }} disabled={!canPrev} onClick={() => setPagina(p => Math.max(1, p - 1))}>
                        Anterior
                    </button>
                    <span className="page-indicator">
                        Página <strong>{currentPage}</strong> de <strong>{maxPage}</strong> — {totalItems} itens
                    </span>
                    <button className="ghost pager-btn next" style={{ marginLeft: '10px;' }} disabled={!canNext} onClick={() => setPagina(p => Math.min(maxPage, p + 1))}>
                        Próxima
                    </button>
                </div>
            </section>

            <Modal
                open={openForm}
                title={editing ? 'Editar produto' : 'Novo Produto'}
                onClose={() => { setOpenForm(false); setEditing(null) }}
            >
                <ProductForm
                    initial={editing as any}
                    onClose={() => { setOpenForm(false); setEditing(null) }}
                    onSave={handleSave}
                />
            </Modal>

            <Confirm
                open={openConfirm.open}
                text="Realmente deseja excluir este produto?"
                onNo={() => setOpenConfirm({ open: false })}
                onYes={() => openConfirm.id && handleDelete(openConfirm.id)}
            />
        </div>
    )
}
