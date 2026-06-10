import { Button, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { t } from '../../../../locales'
import type { Role } from '../../../../types/system'
import StatusBadge from '../../shared/components/StatusBadge'

interface Props {
  roles: Role[]
  onEdit: (role: Role) => void
  onRemove: (id: number) => void
}

function RoleTable({ roles, onEdit, onRemove }: Props) {
  const columns: ColumnsType<Role> = [
    {
      dataIndex: 'roleName',
      title: t('system.roles.roleName'),
    },
    {
      dataIndex: 'roleCode',
      title: t('system.roles.roleCode'),
    },
    {
      render: (_, role) => role.menuCount ?? 0,
      title: t('system.roles.menuCount'),
    },
    {
      render: (_, role) => role.userCount ?? 0,
      title: t('system.roles.userCount'),
    },
    {
      render: (_, role) => <StatusBadge enabled={role.isEnabled} />,
      title: t('system.users.status'),
    },
    {
      fixed: 'right',
      render: (_, role) => (
        <Space>
          <Button onClick={() => onEdit(role)}>{t('common.edit')}</Button>
          <Button danger onClick={() => onRemove(role.id)}>
            {t('common.delete')}
          </Button>
        </Space>
      ),
      title: t('common.actions'),
      width: 160,
    },
  ]

  return (
    <div className="mx-3 mt-5 mb-6 sm:mx-6">
      <Table
        columns={columns}
        dataSource={roles}
        pagination={false}
        rowKey="id"
        scroll={{ x: 720 }}
      />
    </div>
  )
}

export default RoleTable
