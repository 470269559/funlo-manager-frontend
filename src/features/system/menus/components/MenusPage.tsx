import { useEffect, useMemo, useState } from 'react'
import { t } from '../../../../locales'
import type { MenuItem } from '../../../../types/system'
import { flattenMenus } from '../../../../utils/menu'
import ConfirmDialog from '../../shared/components/ConfirmDialog'
import PageCard from '../../shared/components/PageCard'
import MenuForm from './MenuForm'
import MenuTable from './MenuTable'
import {
  createMenu,
  deleteMenu,
  getMenuTree,
  updateMenu,
} from '../../../../services/system/menuService'

const emptyForm = {
  parentId: '',
  menuName: '',
  path: '',
  component: '',
  icon: '',
  sortOrder: '0',
  isVisible: true,
  isEnabled: true,
}

function MenusPage() {
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const menuList = useMemo(() => flattenMenus(menus), [menus])

  const load = async () => {
    setMenus(await getMenuTree())
  }

  useEffect(() => {
    void load()
  }, [])

  function openCreate() {
    setIsCreating(true)
    setEditing(null)
    setForm(emptyForm)
    setError('')
  }

  function openCreateChild(menu: MenuItem) {
    setIsCreating(true)
    setEditing(null)
    setForm({
      ...emptyForm,
      parentId: menu.id.toString(),
    })
    setError('')
  }

  function openEdit(menu: MenuItem) {
    setIsCreating(false)
    setEditing(menu)
    setForm({
      parentId: menu.parentId?.toString() ?? '',
      menuName: menu.menuName,
      path: menu.path ?? '',
      component: menu.component ?? '',
      icon: menu.icon ?? '',
      sortOrder: menu.sortOrder.toString(),
      isVisible: menu.isVisible,
      isEnabled: menu.isEnabled,
    })
    setError('')
  }

  function closeForm() {
    setIsCreating(false)
    setEditing(null)
    setForm(emptyForm)
    setError('')
  }

  async function save() {
    if (isSaving) return
    setError('')
    setIsSaving(true)
    const payload = {
      parentId: form.parentId ? Number(form.parentId) : null,
      menuName: form.menuName,
      path: form.path || null,
      component: form.component || null,
      icon: form.icon || null,
      sortOrder: Number(form.sortOrder),
      isVisible: form.isVisible,
      isEnabled: form.isEnabled,
    }

    try {
      if (editing) {
        await updateMenu(editing.id, payload)
      } else {
        await createMenu(payload)
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
      await deleteMenu(deletingId)
      setDeletingId(null)
      await load()
    } finally {
      setIsDeleting(false)
    }
  }

  const showForm = isCreating || editing !== null

  return (
    <PageCard
      title={t('system.menus.title')}
      description={t('system.menus.description')}
      actionLabel={t('system.menus.create')}
      onAction={openCreate}
    >
      {showForm && (
        <MenuForm
          editingId={editing?.id}
          error={error}
          form={form}
          isSaving={isSaving}
          menuList={menuList}
          onCancel={closeForm}
          onChange={setForm}
          onSave={save}
        />
      )}
      {!showForm && (
        <MenuTable
          menus={menus}
          onCreateChild={openCreateChild}
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

export default MenusPage
