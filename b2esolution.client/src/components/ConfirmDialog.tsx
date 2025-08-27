import React from 'react'
import ProductModal from './ProductModal'

type Props = {
    open: boolean
    text: React.ReactNode
    onYes: () => void
    onNo: () => void
    title?: React.ReactNode
    yesLabel?: string
    noLabel?: string
}
export default function ConfirmDialog({
    open,
    text,
    onYes,
    onNo,
    title = 'Confirmar',
    yesLabel = 'Sim',
    noLabel = 'Não',
}: Props) {
    return (
        <ProductModal open={open} onClose={onNo} title={title} size="sm">
            <p className="confirm-text" style={{ margin: '6px 0 2px' }}>{text}</p>
            <div className="actions">
            <br></br>
                <button style={{ marginRight: '10px', marginTop: '10px' }} className="ghost" onClick={onNo}>{noLabel}</button>
                <button className="danger" onClick={onYes}>{yesLabel}</button>
            </div>
        </ProductModal>
    )
}
