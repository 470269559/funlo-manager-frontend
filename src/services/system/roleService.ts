import { request } from '../request'
import type { Role } from '../../types/system'

export type SaveRolePayload = {
  roleName: string
  roleCode: string
  description: string | null
  isEnabled: boolean
  menuIds: number[]
}

export function getRoles() {
  return request<Role[]>({ url: '/system/roles' })
}

export function getRoleDetail(id: number) {
  return request<Role>({ url: `/system/roles/${id}` })
}

export function createRole(payload: SaveRolePayload) {
  return request({
    url: '/system/roles',
    method: 'POST',
    data: payload,
  })
}

export function updateRole(id: number, payload: SaveRolePayload) {
  return request({
    url: `/system/roles/${id}`,
    method: 'PATCH',
    data: payload,
  })
}

export function deleteRole(id: number) {
  return request({ url: `/system/roles/${id}`, method: 'DELETE' })
}
