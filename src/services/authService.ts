import { request } from './request'
import type { MenuItem, Session, User } from '../types/system'

export type LoginPayload = {
  username: string
  password: string
}

export function login(payload: LoginPayload) {
  return request<Session>({
    url: '/auth/login',
    method: 'POST',
    data: payload,
  })
}

export function getCurrentUser() {
  return request<User>({ url: '/auth/me' })
}

export function getAuthMenus() {
  return request<MenuItem[]>({ url: '/auth/menus' })
}
