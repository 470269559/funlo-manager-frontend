import { Button, Input, InputNumber, Space, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { t } from '../../../../locales'
import type { DictionaryItem, DictionaryType } from '../../../../types/system'
import StatusBadge from '../../shared/components/StatusBadge'

type ItemFormValue = {
  itemLabel: string
  itemValue: string
  sortOrder: string
  isEnabled: boolean
}

interface Props {
  form: ItemFormValue
  isCreating?: boolean
  items: DictionaryItem[]
  selectedType?: DictionaryType
  selectedTypeId: number | null
  onChange: (form: ItemFormValue) => void
  onCreate: () => void | Promise<void>
  onRemove: (id: number) => void
}

function DictionaryItemPanel({
  form,
  isCreating = false,
  items,
  selectedType,
  selectedTypeId,
  onChange,
  onCreate,
  onRemove,
}: Props) {
  const title = selectedType
    ? `${selectedType.dictName}${t('system.dictionaries.itemTitle')}`
    : t('system.dictionaries.itemTitle')

  const columns: ColumnsType<DictionaryItem> = [
    {
      dataIndex: 'itemLabel',
      title: t('system.dictionaries.itemLabel'),
    },
    {
      dataIndex: 'itemValue',
      title: t('system.dictionaries.value'),
    },
    {
      dataIndex: 'sortOrder',
      title: t('system.menus.sortOrder'),
    },
    {
      render: (_, item) => <StatusBadge enabled={item.isEnabled} />,
      title: t('system.users.status'),
    },
    {
      fixed: 'right',
      render: (_, item) => (
        <Space>
          <Button danger onClick={() => onRemove(item.id)}>
            {t('common.delete')}
          </Button>
        </Space>
      ),
      title: t('common.actions'),
      width: 110,
    },
  ]

  return (
    <section className="rounded-lg border border-[#e4e4e7] bg-white p-4">
      <h3 className="mt-0 mb-3.5 text-base font-semibold">{title}</h3>
      <div className="grid gap-2.5">
        <Input
          placeholder={t('system.dictionaries.itemLabel')}
          value={form.itemLabel}
          onChange={(event) =>
            onChange({ ...form, itemLabel: event.target.value })
          }
        />
        <Input
          placeholder={t('system.dictionaries.itemValue')}
          value={form.itemValue}
          onChange={(event) =>
            onChange({ ...form, itemValue: event.target.value })
          }
        />
        <InputNumber
          className="w-full"
          placeholder={t('system.menus.sortOrder')}
          value={Number(form.sortOrder)}
          onChange={(value) =>
            onChange({ ...form, sortOrder: String(value ?? 0) })
          }
        />
        <Button
          block
          disabled={!selectedTypeId}
          icon={<PlusOutlined />}
          loading={isCreating}
          type="primary"
          onClick={() => void onCreate()}
        >
          {t('system.dictionaries.createItem')}
        </Button>
      </div>
      <div className="mt-5">
        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          rowKey="id"
          scroll={{ x: 620 }}
        />
      </div>
    </section>
  )
}

export default DictionaryItemPanel
