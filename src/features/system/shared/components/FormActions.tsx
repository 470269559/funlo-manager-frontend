import { Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { t } from '../../../../locales'

type FormActionsProps = {
  isSaving?: boolean
  onCancel: () => void
  onSave: () => void | Promise<void>
}

function FormActions({ isSaving = false, onCancel, onSave }: FormActionsProps) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <Button className="min-w-[88px]" disabled={isSaving} onClick={onCancel}>
        {t('common.cancel')}
      </Button>
      <Button
        className="min-w-[88px]"
        icon={<SaveOutlined />}
        loading={isSaving}
        type="primary"
        onClick={() => void onSave()}
      >
        {t('common.save')}
      </Button>
    </div>
  )
}

export default FormActions
