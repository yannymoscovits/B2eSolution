import { useEffect, useState } from 'react'

type Props = {
    initial?: any
    onSave: (payload: { nome: string; valor: number }, id?: number) => void | Promise<void>
    onClose: () => void
}
function getId(p: any): number {
    return Number(p?.id ?? p?.idProduto ?? p?.produtoId ?? p?.Id ?? 0)
}
function pickName(p: any): string {
    return String(p?.nome ?? p?.name ?? p?.productName ?? p?.Name ?? '')
}
function pickPrice(p: any): number {
    const raw = p?.valor ?? p?.preco ?? p?.price ?? p?.Price ?? p?.Valor ?? 0
    const n = typeof raw === 'string' ? Number(raw.replace(',', '.')) : Number(raw)
    return Number.isFinite(n) ? n : 0
}
function toNumberPt(v: string): number {
    const n = Number((v ?? '').replace(/\./g, '').replace(',', '.'))
    return Number.isFinite(n) ? n : NaN
}
export default function ProductForm({ initial, onSave, onClose }: Props) {
    const [nome, setNome] = useState('')
    const [valor, setValor] = useState('') 
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (initial) {
            setNome(pickName(initial))
            const p = pickPrice(initial)
            setValor(p ? String(p).replace('.', ',') : '')
        } else {
            setNome('')
            setValor('')
        }
    }, [initial])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const nomeTrim = nome.trim()
        const vnum = toNumberPt(valor)

        if (!nomeTrim) {
            alert('Informe o nome do produto.')
            return
        }
        if (!Number.isFinite(vnum)) {
            alert('Informe um valor válido (ex.: 10,00).')
            return
        }

        setSaving(true)
        try {
            await onSave({ nome: nomeTrim, valor: vnum }, getId(initial))
        } finally {
            setSaving(false)
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <label>Nome do produto</label>
            <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Feijão"
                autoFocus
            />

            <label>Valor (R$)</label>
            <input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+([,\.][0-9]{0,2})?$"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex.: 10,00"
            />

            <div className="actions">
                <button style={{ marginRight: '10px', marginTop: '10px' }} type="button" className="ghost" onClick={onClose} disabled={saving}>
                    Fechar
                </button>
                <button type="submit" className="primary" disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </form>
    )
}
