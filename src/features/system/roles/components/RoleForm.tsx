import { Alert, Checkbox, Form, Input, Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import type { Key } from 'react'
import { t } from '../../../../locales'
import type { MenuItem } from '../../../../types/system'
import FormActions from '../../shared/components/FormActions'

type RoleFormValue = {
  roleName: string
  roleCode: string
  description: string
  isEnabled: boolean
  menuIds: number[]
}

interface Props {
  error: string
  form: RoleFormValue
  isSaving?: boolean
  menuTree: MenuItem[]
  onCancel: () => void
  onChange: (form: RoleFormValue) => void
  onSave: () => void | Promise<void>
}

function buildTreeData(menus: MenuItem[]): DataNode[] {
  return menus.map((menu) => ({
    key: menu.id,
    title: menu.menuName,
    children: menu.children?.length ? buildTreeData(menu.children) : undefined,
  }))
}

function normalizeCheckedKeys(keys: Key[] | { checked: Key[] }) {
  return (Array.isArray(keys) ? keys : keys.checked).map(Number)
}

function RoleForm({
  error,
  form,
  isSaving = false,
  menuTree,
  onCancel,
  onChange,
  onSave,
}: Props) {
  return (
    <section className="mx-3 mt-5 mb-5 rounded-lg border border-[#e4e4e7] bg-white p-4 sm:mx-6 sm:p-[18px]">
      <Form layout="vertical">
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-4">
          <Form.Item className="mb-0" label={t('system.roles.roleName')}>
            <Input
              value={form.roleName}
              onChange={(event) =>
                onChange({ ...form, roleName: event.target.value })
              }
            />
          </Form.Item>
          <Form.Item className="mb-0" label={t('system.roles.roleCode')}>
            <Input
              value={form.roleCode}
              onChange={(event) =>
                onChange({ ...form, roleCode: event.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            className="mb-0"
            label={t('system.roles.descriptionField')}
          >
            <Input
              value={form.description}
              onChange={(event) =>
                onChange({ ...form, description: event.target.value })
              }
            />
          </Form.Item>
          <Checkbox
            checked={form.isEnabled}
            onChange={(event) =>
              onChange({ ...form, isEnabled: event.target.checked })
            }
          >
            {t('common.enabled')}
          </Checkbox>
        </div>
        <div className="mt-4 rounded-md border border-[#e4e4e7] bg-[#fafafa] p-3.5">
          <Tree
            checkable
            defaultExpandAll
            checkedKeys={form.menuIds}
            treeData={buildTreeData(menuTree)}
            onCheck={(checkedKeys) =>
              onChange({
                ...form,
                menuIds: normalizeCheckedKeys(checkedKeys),
              })
            }
          />
        </div>
      </Form>
      {error && <Alert className="mt-3" message={error} showIcon type="error" />}
      <FormActions isSaving={isSaving} onCancel={onCancel} onSave={onSave} />
    </section>
  )
}

export default RoleForm
