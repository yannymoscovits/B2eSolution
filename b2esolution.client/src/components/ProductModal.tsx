import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type Props = {
    open: boolean
    onClose: () => void
    title?: React.ReactNode
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg'
    className?: string
    closeOnBackdrop?: boolean
}
export default function ProductModal({
    open,
    onClose,
    title,
    children,
    size = 'sm',
    className = '',
    closeOnBackdrop = true,
}: Props) {
    const backdropRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = prev
        }
    }, [open, onClose])

    if (!open) return null

    const sizeClass =
        size === 'lg' ? 'modal--lg' :
            size === 'md' ? 'modal--md' :
                'modal--sm'

    const handleBackdrop = (e: React.MouseEvent) => {
        if (!closeOnBackdrop) return
        if (e.target === backdropRef.current) onClose()
    }

    return createPortal(
        <div
            className="modal-backdrop"
            ref={backdropRef}
            onMouseDown={handleBackdrop}
            aria-hidden={false}
        >
            <div
                className={`modal ${sizeClass} ${className}`}
                role="dialog"
                aria-modal="true"
                aria-label={typeof title === 'string' ? title : undefined}
            >
                <div className="modal-header">
                    <strong>{title}</strong> 
                </div>
                <br></br>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}
