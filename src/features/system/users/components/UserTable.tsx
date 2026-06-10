import { Button, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { t } from '../../../../locales'
import type { User } from '../../../../types/system'
import { formatDate } from '../../../../utils/date'
import StatusBadge from '../../shared/components/StatusBadge'

interface Props {
  users: User[]
  onEdit: (user: User) => void
  onRemove: (id: number) => void
}

function UserTable({ users, onEdit, onRemove }: Props) {
  const columns: ColumnsType<User> = [
    {
      dataIndex: 'username',
      title: t('system.users.username'),
    },
    {
      render: (_, user) => user.nickname || t('common.empty'),
      title: t('system.users.nickname'),
    },
    {
      render: (_, user) => user.role.roleName,
      title: t('system.users.role'),
    },
    {
      render: (_, user) => <StatusBadge enabled={user.isEnabled} />,
      title: t('system.users.status'),
    },
    {
      render: (_, user) => formatDate(user.createdAt),
      title: t('system.users.createdAt'),
    },
    {
      fixed: 'right',
      render: (_, user) => (
        <Space>
          <Button onClick={() => onEdit(user)}>{t('common.edit')}</Button>
          <Button danger onClick={() => onRemove(user.id)}>
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
        dataSource={users}
        pagination={false}
        rowKey="id"
        scroll={{ x: 760 }}
      />
    </div>
  )
}

export default UserTable
