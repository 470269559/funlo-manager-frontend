import { useEffect, useState } from "react";
import { t } from "../../../../locales";
import type { MenuItem, Role } from "../../../../types/system";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import PageCard from "../../shared/components/PageCard";
import RoleForm from "./RoleForm";
import RoleTable from "./RoleTable";
import { getMenuTree } from "../../../../services/system/menuService";
import {
  createRole,
  deleteRole,
  getRoleDetail,
  getRoles,
  updateRole,
} from "../../../../services/system/roleService";

const emptyForm = {
  roleName: "",
  roleCode: "",
  description: "",
  isEnabled: true,
  menuIds: [] as number[],
};

function getDescendantMenuIds(menu: MenuItem) {
  const result: number[] = [];
  const walk = (items: MenuItem[]) => {
    for (const item of items) {
      result.push(item.id);
      if (item.children?.length) {
        walk(item.children);
      }
    }
  };

  walk(menu.children ?? []);
  return result;
}

function normalizeRoleMenuIdsForTree(menus: MenuItem[], menuIds: number[]) {
  const selectedIds = new Set(menuIds);
  const walk = (items: MenuItem[]) => {
    for (const item of items) {
      if (item.children?.length) {
        const descendantIds = getDescendantMenuIds(item);
        const hasPartialChildren = descendantIds.some((id) => !selectedIds.has(id));

        if (selectedIds.has(item.id) && hasPartialChildren) {
          selectedIds.delete(item.id);
        }

        walk(item.children);
      }
    }
  };

  walk(menus);
  return [...selectedIds];
}

function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = async () => {
    const [nextRoles, nextMenus] = await Promise.all([
      getRoles(),
      getMenuTree(),
    ]);
    setRoles(nextRoles);
    setMenus(nextMenus);
  };

  useEffect(() => {
    void load();
  }, []);

  function openCreate() {
    setIsCreating(true);
    setEditing(null);
    setForm(emptyForm);
    setError("");
  }

  async function openEdit(role: Role) {
    setIsCreating(false);
    const detail = await getRoleDetail(role.id);
    setEditing(detail);
    setForm({
      roleName: detail.roleName,
      roleCode: detail.roleCode,
      description: detail.description ?? "",
      isEnabled: detail.isEnabled,
      menuIds: normalizeRoleMenuIdsForTree(
        menus,
        detail.roleMenus?.map((item) => item.menuId) ?? [],
      ),
    });
    setError("");
  }

  function closeForm() {
    setIsCreating(false);
    setEditing(null);
    setForm(emptyForm);
    setError("");
  }

  async function save() {
    if (isSaving) return;
    setError("");
    setIsSaving(true);
    const payload = {
      roleName: form.roleName,
      roleCode: form.roleCode,
      description: form.description || null,
      isEnabled: form.isEnabled,
      menuIds: form.menuIds,
    };

    try {
      if (editing) {
        await updateRole(editing.id, payload);
      } else {
        await createRole(payload);
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmRemove() {
    if (!deletingId || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteRole(deletingId);
      setDeletingId(null);
      await load();
    } finally {
      setIsDeleting(false);
    }
  }

  const showForm = isCreating || editing !== null;

  return (
    <PageCard
      title={t("system.roles.title")}
      description={t("system.roles.description")}
      actionLabel={t("system.roles.create")}
      onAction={openCreate}>
      {showForm && (
        <RoleForm
          error={error}
          form={form}
          isSaving={isSaving}
          menuTree={menus}
          onCancel={closeForm}
          onChange={setForm}
          onSave={save}
        />
      )}
      {!showForm && (
        <RoleTable
          roles={roles}
          onEdit={(role) => void openEdit(role)}
          onRemove={setDeletingId}
        />
      )}
      <ConfirmDialog
        description={t("common.deleteConfirmDescription")}
        isOpen={deletingId !== null}
        isProcessing={isDeleting}
        title={t("common.deleteConfirmTitle")}
        onCancel={() => setDeletingId(null)}
        onConfirm={confirmRemove}
      />
    </PageCard>
  );
}

export default RolesPage;
