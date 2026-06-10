import { Modal } from 'antd'
import { t } from '../../../../locales'

interface Props {
  description?: string
  isOpen: boolean
  isProcessing?: boolean
  title: string
  onCancel: () => void
  onConfirm: () => void | Promise<void>
}

function ConfirmDialog({
  description,
  isOpen,
  isProcessing = false,
  title,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      centered
      cancelButtonProps={{ className: 'min-w-[88px]', disabled: isProcessing }}
      cancelText={t('common.cancel')}
      confirmLoading={isProcessing}
      okButtonProps={{
        className: 'min-w-[88px]',
        danger: true,
        disabled: isProcessing,
      }}
      okText={t('common.confirmDelete')}
      open={isOpen}
      title={title}
      onCancel={onCancel}
      onOk={() => void onConfirm()}
    >
      {description && (
        <p className="m-0 text-sm leading-6 text-[#717182]">{description}</p>
      )}
    </Modal>
  )
}

export default ConfirmDialog
