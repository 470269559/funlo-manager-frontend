import { useEffect, useState } from 'react'
import { Alert, Checkbox, Form, Input, Select } from 'antd'
import { t } from '../../../../locales'
import type { Role, User } from '../../../../types/system'
import ConfirmDialog from '../../shared/components/ConfirmDialog'
import FormActions from '../../shared/components/FormActions'
import PageCard from '../../shared/components/PageCard'
import UserTable from './UserTable'
import { getRoles } from '../../../../services/system/roleService'
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../../../../services/system/userService'

function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: '',
    nickname: '',
    roleId: '',
    isEnabled: true,
  })
  const [error, setError] = useState('')

  const load = async () => {
    const [nextUsers, nextRoles] = await Promise.all([
      getUsers(),
      getRoles(),
    ])
    setUsers(nextUsers)
    setRoles(nextRoles)
  }

  useEffect(() => {
    void load()
  }, [])

  function openCreate() {
    setIsCreating(true)
    setEditing(null)
    setForm({
      username: '',
      password: '',
      nickname: '',
      roleId: roles[0]?.id.toString() ?? '',
      isEnabled: true,
    })
    setError('')
  }

  function openEdit(user: User) {
    setIsCreating(false)
    setEditing(user)
    setForm({
      username: user.username,
      password: '',
      nickname: user.nickname ?? '',
      roleId: user.roleId.toString(),
      isEnabled: user.isEnabled,
    })
    setError('')
  }

  function closeForm() {
    setIsCreating(false)
    setEditing(null)
    setForm({
      username: '',
      password: '',
      nickname: '',
      roleId: '',
      isEnabled: true,
    })
    setError('')
  }

  async function save() {
    if (isSaving) return
    setError('')
    setIsSaving(true)
    const payload = {
      username: form.username,
      nickname: form.nickname || null,
      roleId: Number(form.roleId),
      isEnabled: form.isEnabled,
      ...(form.password ? { password: form.password } : {}),
    }

    try {
      if (editing) {
        await updateUser(editing.id, payload)
      } else {
        await createUser({ ...payload, password: form.password })
      }
      closeForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.saveFailed'))
    } finally {
      setIsSaving(false)
    }
  }

  async function confirmRemove() {
    if (!deletingId || isDeleting) return
    setIsDeleting(true)
    try {
      await deleteUser(deletingId)
      setDeletingId(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  const showForm = isCreating || editing !== null

  return (
    <PageCard
      title={t('system.users.title')}
      description={t('system.users.description')}
      actionLabel={t('system.users.create')}
      onAction={openCreate}
    >
      {showForm && (
        <section className="mx-3 mt-5 mb-5 rounded-lg border border-[#e4e4e7] bg-white p-4 sm:mx-6 sm:p-[18px]">
          <Form layout="vertical">
            <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 xl:grid-cols-4">
              <Form.Item className="mb-0" label={t('system.users.username')}>
                <Input
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item className="mb-0" label={t('auth.password')}>
                <Input.Password
                  placeholder={editing ? t('common.keepPassword') : ''}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item className="mb-0" label={t('system.users.nickname')}>
                <Input
                  value={form.nickname}
                  onChange={(e) =>
                    setForm({ ...form, nickname: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item className="mb-0" label={t('system.users.role')}>
                <Select
                  options={roles.map((role) => ({
                    label: role.roleName,
                    value: role.id.toString(),
                  }))}
                  placeholder={t('common.selectPlaceholder')}
                  value={form.roleId || undefined}
                  onChange={(value) => setForm({ ...form, roleId: value })}
                />
              </Form.Item>
              <Checkbox
                checked={form.isEnabled}
                onChange={(e) =>
                  setForm({ ...form, isEnabled: e.target.checked })
                }
              >
                {t('common.enabled')}
              </Checkbox>
            </div>
          </Form>
          {error && (
            <Alert className="mt-3" message={error} showIcon type="error" />
          )}
          <FormActions isSaving={isSaving} onCancel={closeForm} onSave={save} />
        </section>
      )}
      {!showForm && (
        <UserTable
          users={users}
          onEdit={openEdit}
          onRemove={setDeletingId}
        />
      )}
      <ConfirmDialog
        description={t('common.deleteConfirmDescription')}
        isOpen={deletingId !== null}
        isProcessing={isDeleting}
        title={t('common.deleteConfirmTitle')}
        onCancel={() => setDeletingId(null)}
        onConfirm={confirmRemove}
      />
    </PageCard>
  )
}

export default UsersPage
