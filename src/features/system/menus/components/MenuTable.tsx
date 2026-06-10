import { Button, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { t } from '../../../../locales'
import type { MenuItem } from '../../../../types/system'
import StatusBadge from '../../shared/components/StatusBadge'

interface Props {
  menus: MenuItem[]
  onCreateChild: (menu: MenuItem) => void
  onEdit: (menu: MenuItem) => void
  onRemove: (id: number) => void
}

function MenuTable({ menus, onCreateChild, onEdit, onRemove }: Props) {
  const columns: ColumnsType<MenuItem> = [
    {
      dataIndex: 'menuName',
      title: t('system.menus.menuName'),
    },
    {
      render: (_, menu) => menu.path || t('common.empty'),
      title: t('system.menus.path'),
    },
    {
      render: (_, menu) => menu.component || t('common.empty'),
      title: t('system.menus.component'),
    },
    {
      dataIndex: 'sortOrder',
      title: t('system.menus.sortOrder'),
    },
    {
      render: (_, menu) =>
        menu.isVisible ? t('system.menus.visible') : t('system.menus.hidden'),
      title: t('system.menus.visible'),
    },
    {
      render: (_, menu) => <StatusBadge enabled={menu.isEnabled} />,
      title: t('system.users.status'),
    },
    {
      fixed: 'right',
      render: (_, menu) => (
        <Space>
          <Button onClick={() => onCreateChild(menu)}>
            {t('system.menus.createChild')}
          </Button>
          <Button onClick={() => onEdit(menu)}>{t('common.edit')}</Button>
          <Button danger onClick={() => onRemove(menu.id)}>
            {t('common.delete')}
          </Button>
        </Space>
      ),
      title: t('common.actions'),
      width: 260,
    },
  ]

  return (
    <div className="mx-3 mt-5 mb-6 sm:mx-6">
      <Table
        columns={columns}
        dataSource={menus}
        defaultExpandAllRows
        pagination={false}
        rowKey="id"
        scroll={{ x: 960 }}
      />
    </div>
  )
}

export default MenuTable
