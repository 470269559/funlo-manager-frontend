import { request } from '../request'
import type { User } from '../../types/system'

export type SaveUserPayload = {
  username: string
  password?: string
  nickname: string | null
  roleId: number
  isEnabled: boolean
}

export function getUsers() {
  return request<User[]>({ url: '/system/users' })
}

export function createUser(payload: SaveUserPayload) {
  return request({
    url: '/system/users',
    method: 'POST',
    data: payload,
  })
}

export function updateUser(id: number, payload: SaveUserPayload) {
  return request({
    url: `/system/users/${id}`,
    method: 'PATCH',
    data: payload,
  })
}

export function deleteUser(id: number) {
  return request({ url: `/system/users/${id}`, method: 'DELETE' })
}
