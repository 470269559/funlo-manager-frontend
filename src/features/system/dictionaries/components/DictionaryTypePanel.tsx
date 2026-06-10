import { Button, Input } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { t } from '../../../../locales'
import type { DictionaryType } from '../../../../types/system'

type TypeFormValue = {
  dictName: string
  dictCode: string
  description: string
  isEnabled: boolean
}

interface Props {
  form: TypeFormValue
  isCreating?: boolean
  selectedTypeId: number | null
  types: DictionaryType[]
  onChange: (form: TypeFormValue) => void
  onCreate: () => void | Promise<void>
  onRemove: (id: number) => void
  onSelect: (id: number) => void
}

function DictionaryTypePanel({
  form,
  isCreating = false,
  selectedTypeId,
  types,
  onChange,
  onCreate,
  onRemove,
  onSelect,
}: Props) {
  return (
    <section className="rounded-lg border border-[#e4e4e7] bg-white p-4">
      <h3 className="mt-0 mb-3.5 text-base font-semibold">
        {t('system.dictionaries.typeTitle')}
      </h3>
      <div className="grid gap-2.5">
        <Input
          placeholder={t('system.dictionaries.dictName')}
          value={form.dictName}
          onChange={(event) =>
            onChange({ ...form, dictName: event.target.value })
          }
        />
        <Input
          placeholder={t('system.dictionaries.dictCode')}
          value={form.dictCode}
          onChange={(event) =>
            onChange({ ...form, dictCode: event.target.value })
          }
        />
        <Input
          placeholder={t('system.roles.descriptionField')}
          value={form.description}
          onChange={(event) =>
            onChange({ ...form, description: event.target.value })
          }
        />
        <Button
          block
          icon={<PlusOutlined />}
          loading={isCreating}
          type="primary"
          onClick={() => void onCreate()}
        >
          {t('system.dictionaries.createType')}
        </Button>
      </div>
      <div className="mt-3.5 grid gap-2">
        {types.map((type) => (
          <div
            key={type.id}
            className={`flex cursor-pointer items-center justify-between gap-2.5 rounded-md border bg-white p-3 text-left transition-colors hover:border-[#030213] hover:bg-[#f3f3f5] ${
              selectedTypeId === type.id
                ? 'border-[#030213] bg-[#f3f3f5]'
                : 'border-[#e4e4e7]'
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onSelect(type.id)
            }}
            onClick={() => onSelect(type.id)}
          >
            <span className="grid gap-1">
              <strong>{type.dictName}</strong>
              <small className="text-[#717182]">{type.dictCode}</small>
            </span>
            <Button
              danger
              disabled={isCreating}
              icon={<DeleteOutlined />}
              size="small"
              type="text"
              onClick={(event) => {
                event.stopPropagation()
                onRemove(type.id)
              }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default DictionaryTypePanel
