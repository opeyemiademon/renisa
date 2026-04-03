'use client'

import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} size="sm" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
