import { request } from '../request'
import type { MenuItem } from '../../types/system'

export type SaveMenuPayload = {
  parentId: number | null
  menuName: string
  path: string | null
  component: string | null
  icon: string | null
  sortOrder: number
  isVisible: boolean
  isEnabled: boolean
}

export function getMenuTree() {
  return request<MenuItem[]>({ url: '/system/menus/tree' })
}

export function createMenu(payload: SaveMenuPayload) {
  return request({
    url: '/system/menus',
    method: 'POST',
    data: payload,
  })
}

export function updateMenu(id: number, payload: SaveMenuPayload) {
  return request({
    url: `/system/menus/${id}`,
    method: 'PATCH',
    data: payload,
  })
}

export function deleteMenu(id: number) {
  return request({ url: `/system/menus/${id}`, method: 'DELETE' })
}
