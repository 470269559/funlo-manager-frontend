import { Alert, Checkbox, Form, Input, InputNumber, Select } from 'antd'
import { t } from '../../../../locales'
import type { MenuItem } from '../../../../types/system'
import { getFinalMenuLabel } from '../../../../utils/menu'
import FormActions from '../../shared/components/FormActions'

type MenuFormValue = {
  parentId: string
  menuName: string
  path: string
  component: string
  icon: string
  sortOrder: string
  isVisible: boolean
  isEnabled: boolean
}

interface Props {
  editingId?: number
  error: string
  form: MenuFormValue
  isSaving?: boolean
  menuList: MenuItem[]
  onCancel: () => void
  onChange: (form: MenuFormValue) => void
  onSave: () => void | Promise<void>
}

function MenuForm({
  editingId,
  error,
  form,
  isSaving = false,
  menuList,
  onCancel,
  onChange,
  onSave,
}: Props) {
  return (
    <section className="mx-3 mt-5 mb-5 rounded-lg border border-[#e4e4e7] bg-white p-4 sm:mx-6 sm:p-[18px]">
      <Form layout="vertical">
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-4">
          <Form.Item className="mb-0" label={t('system.menus.parent')}>
            <Select
              allowClear
              options={menuList
                .filter((menu) => menu.id !== editingId)
                .map((menu) => ({
                  label: getFinalMenuLabel(menu),
                  value: menu.id.toString(),
                }))}
              placeholder={t('common.none')}
              value={form.parentId || undefined}
              onChange={(value) =>
                onChange({ ...form, parentId: value ?? '' })
              }
            />
          </Form.Item>
          <Form.Item className="mb-0" label={t('system.menus.menuName')}>
            <Input
              value={form.menuName}
              onChange={(event) =>
                onChange({ ...form, menuName: event.target.value })
              }
            />
          </Form.Item>
          <Form.Item className="mb-0" label={t('system.menus.path')}>
            <Input
              value={form.path}
              onChange={(event) =>
                onChange({ ...form, path: event.target.value })
              }
            />
          </Form.Item>
          <Form.Item className="mb-0" label={t('system.menus.component')}>
            <Input
              value={form.component}
              onChange={(event) =>
                onChange({ ...form, component: event.target.value })
              }
            />
          </Form.Item>
          <Form.Item className="mb-0" label={t('system.menus.icon')}>
            <Input
              value={form.icon}
              onChange={(event) =>
                onChange({ ...form, icon: event.target.value })
              }
            />
          </Form.Item>
          <Form.Item className="mb-0" label={t('system.menus.sortOrder')}>
            <InputNumber
              className="w-full"
              value={Number(form.sortOrder)}
              onChange={(value) =>
                onChange({ ...form, sortOrder: String(value ?? 0) })
              }
            />
          </Form.Item>
          <Checkbox
            checked={form.isVisible}
            onChange={(event) =>
              onChange({ ...form, isVisible: event.target.checked })
            }
          >
            {t('system.menus.visibility')}
          </Checkbox>
          <Checkbox
            checked={form.isEnabled}
            onChange={(event) =>
              onChange({ ...form, isEnabled: event.target.checked })
            }
          >
            {t('common.enabled')}
          </Checkbox>
        </div>
      </Form>
      {error && <Alert className="mt-3" message={error} showIcon type="error" />}
      <FormActions isSaving={isSaving} onCancel={onCancel} onSave={onSave} />
    </section>
  )
}

export default MenuForm
