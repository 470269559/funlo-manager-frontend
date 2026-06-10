import { Tag } from 'antd'
import { t } from '../../../../locales'

type StatusBadgeProps = {
  enabled: boolean
}

function StatusBadge({ enabled }: StatusBadgeProps) {
  return <Tag color={enabled ? 'success' : 'error'}>{enabled ? t('common.enabled') : t('common.disabled')}</Tag>
}

export default StatusBadge
