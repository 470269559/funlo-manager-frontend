import type { MenuItem } from '../types/system'

export function flattenMenus(menus: MenuItem[]) {
  const result: MenuItem[] = []
  const walk = (items: MenuItem[]) => {
    for (const item of items) {
      result.push(item)
      if (item.children?.length) walk(item.children)
    }
  }
  walk(menus)
  return result
}

export function getFinalMenuLabel(menu: MenuItem) {
  return menu.parentId ? `└ ${menu.menuName}` : menu.menuName
}

export function getFirstMenuPath(menus: MenuItem[], fallbackPath: string) {
  let current = menus[0]

  while (current) {
    if (current.children?.length) {
      current = current.children[0]
      continue
    }

    if (current.path) {
      return current.path
    }

    break
  }

  return fallbackPath
}
