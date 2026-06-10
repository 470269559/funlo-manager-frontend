export type Role = {
  id: number
  roleName: string
  roleCode: string
  description?: string | null
  isEnabled: boolean
  menuCount?: number
  userCount?: number
  roleMenus?: Array<{ menuId: number; menu: MenuItem }>
}

export type User = {
  id: number
  username: string
  nickname?: string | null
  roleId: number
  role: Role
  isEnabled: boolean
  createdAt: string
}

export type MenuItem = {
  id: number
  parentId?: number | null
  menuName: string
  path?: string | null
  component?: string | null
  icon?: string | null
  sortOrder: number
  isVisible: boolean
  isEnabled: boolean
  children?: MenuItem[]
}

export type DictionaryType = {
  id: number
  dictName: string
  dictCode: string
  description?: string | null
  isEnabled: boolean
  items?: DictionaryItem[]
}

export type DictionaryItem = {
  id: number
  typeId: number
  itemLabel: string
  itemValue: string
  sortOrder: number
  isEnabled: boolean
}

export type Session = {
  accessToken: string
  user: User
}
