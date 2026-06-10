import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Button } from 'antd'
import {
  BookOutlined,
  DashboardOutlined,
  LeftOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { t } from '../locales'
import { getDisplayName, useAuthStore } from '../stores/authStore'
import type { MenuItem } from '../types/system'

const iconMap: Record<string, ReactNode> = {
  book: <BookOutlined />,
  dashboard: <DashboardOutlined />,
  dictionary: <BookOutlined />,
  dictionaries: <BookOutlined />,
  menu: <MenuOutlined />,
  role: <SafetyCertificateOutlined />,
  roles: <SafetyCertificateOutlined />,
  setting: <SettingOutlined />,
  settings: <SettingOutlined />,
  shield: <SafetyCertificateOutlined />,
  system: <SettingOutlined />,
  team: <TeamOutlined />,
  user: <TeamOutlined />,
  users: <TeamOutlined />,
}

function getMenuIcon(menu: MenuItem) {
  const iconKey = menu.icon?.trim().toLowerCase()
  if (iconKey && iconMap[iconKey]) {
    return iconMap[iconKey]
  }

  if (menu.path?.includes('user')) return iconMap.users
  if (menu.path?.includes('role')) return iconMap.roles
  if (menu.path?.includes('menu')) return iconMap.menu
  if (menu.path?.includes('dictionar')) return iconMap.dictionaries
  if (menu.path?.includes('dashboard')) return iconMap.dashboard
  return menu.children?.length ? iconMap.system : iconMap.menu
}

function findMenuByPath(menus: MenuItem[], pathname: string): MenuItem | undefined {
  for (const menu of menus) {
    if (menu.path && pathname.startsWith(menu.path)) {
      return menu
    }
    const child = findMenuByPath(menu.children ?? [], pathname)
    if (child) {
      return child
    }
  }
  return undefined
}

function isMenuActive(menu: MenuItem, pathname: string): boolean {
  return Boolean(
    (menu.path && pathname.startsWith(menu.path)) ||
      menu.children?.some((child) => isMenuActive(child, pathname)),
  )
}

function ManagerLayout() {
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const menus = useAuthStore((state) => state.menus)
  const session = useAuthStore((state) => state.session)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [openMenuIds, setOpenMenuIds] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const firstMenu = menus[0]
    if (!firstMenu?.children?.length) return

    setOpenMenuIds((current) => {
      if (Object.keys(current).length > 0) {
        return current
      }

      return { [firstMenu.id]: true }
    })
  }, [menus])

  if (!session) return null

  const userName = getDisplayName(session.user)
  const closeMobileSidebar = () => setMobileSidebarOpen(false)
  const pageTitle =
    findMenuByPath(menus, location.pathname)?.menuName ?? t('app.boot')

  function isMenuOpen(menu: MenuItem) {
    return openMenuIds[menu.id] ?? isMenuActive(menu, location.pathname)
  }

  function toggleMenu(menu: MenuItem) {
    setOpenMenuIds((current) => ({
      ...current,
      [menu.id]: !isMenuOpen(menu),
    }))
  }

  function renderCollapsedMenu(menu: MenuItem) {
    if (menu.path && !menu.children?.length) {
      return (
        <NavLink
          className={({ isActive }) =>
            `flex h-[38px] items-center justify-center rounded-md text-lg hover:bg-[#e9ebef] ${
              isActive ? 'bg-[#e9ebef] text-[#030213]' : 'text-[#18181b]'
            }`
          }
          key={menu.id}
          title={menu.menuName}
          onClick={closeMobileSidebar}
          to={menu.path}
        >
          {getMenuIcon(menu)}
        </NavLink>
      )
    }

    return (
      <div key={menu.id}>
        <button
          className={`flex h-[38px] w-full cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-lg hover:bg-[#e9ebef] ${
            isMenuActive(menu, location.pathname)
              ? 'bg-[#e9ebef] text-[#030213]'
              : 'text-[#18181b]'
          }`}
          title={menu.menuName}
          type="button"
          onClick={() => toggleMenu(menu)}
        >
          {getMenuIcon(menu)}
        </button>
        <div
          className={`mt-1 grid gap-1 overflow-hidden border-t border-[#e4e4e7] transition-all duration-200 ease-out ${
            isMenuOpen(menu)
              ? 'max-h-96 translate-y-0 pt-2 opacity-100'
              : 'max-h-0 -translate-y-1 pt-0 opacity-0'
          }`}
        >
          {(menu.children ?? []).map(renderCollapsedMenu)}
        </div>
      </div>
    )
  }

  function renderExpandedMenu(menu: MenuItem) {
    if (menu.path && !menu.children?.length) {
      return (
        <NavLink
          className={({ isActive }) =>
            `flex h-[38px] w-full items-center rounded-md px-2.5 text-sm font-semibold text-[#18181b] hover:bg-[#e9ebef] ${
              isActive ? 'bg-[#e9ebef] text-[#030213]' : 'bg-transparent'
            }`
          }
          key={menu.id}
          title={menu.menuName}
          to={menu.path}
          onClick={closeMobileSidebar}
        >
          <span className="text-lg">{getMenuIcon(menu)}</span>
          <span className="ml-3 text-[14px]">{menu.menuName}</span>
        </NavLink>
      )
    }

    return (
      <div key={menu.id}>
        <button
          className={`mt-1 flex min-h-[38px] w-full cursor-pointer items-center rounded-md border-0 bg-transparent px-2.5 text-sm font-semibold hover:bg-[#e9ebef] ${
            isMenuActive(menu, location.pathname)
              ? 'bg-[#e9ebef] text-[#030213]'
              : 'text-[#18181b]'
          }`}
          title={menu.menuName}
          type="button"
          onClick={() => toggleMenu(menu)}
        >
          <span className="text-lg">{getMenuIcon(menu)}</span>
          <span className="ml-3 text-[14px]">{menu.menuName}</span>
          <span
            className={`ml-auto h-2 w-2 border-t-1 border-l-1 border-[#030213] transition-transform duration-200 ${
              isMenuOpen(menu)
                ? 'translate-y-1 rotate-45'
                : '-translate-y-0.5 rotate-[225deg]'
            }`}
          />
        </button>

        <div
          className={`ml-4 grid gap-1 overflow-hidden border-l border-[#e4e4e7] pl-3 transition-all duration-200 ease-out ${
            isMenuOpen(menu)
              ? 'max-h-96 translate-y-0 opacity-100'
              : 'max-h-0 -translate-y-1 opacity-0'
          }`}
        >
          {(menu.children ?? []).map(renderExpandedMenu)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f8] text-[#030213]">
      {mobileSidebarOpen && (
        <div
          aria-label={t('layout.closeSidebar')}
          className="fixed inset-0 z-30 bg-black/35 md:hidden"
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter') closeMobileSidebar()
          }}
          onClick={closeMobileSidebar}
        />
      )}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-none flex-col border-r border-[#e4e4e7] bg-white transition-[width,transform] duration-200 md:static md:translate-x-0 ${
          collapsed ? 'w-[76px]' : 'w-[256px]'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div
          className={`flex h-16 items-center border-b border-[#e4e4e7] ${
            collapsed ? 'justify-between px-3' : 'gap-3 px-4'
          }`}
        >
          <div
            className={`grid flex-none place-items-center rounded-lg bg-[#030213] font-extrabold text-white ${
              collapsed ? 'h-7 w-7 text-[13px]' : 'h-8 w-8 text-[15px]'
            }`}
          >
            F
          </div>
          {!collapsed && (
            <strong className="min-w-0 flex-1 overflow-hidden text-[17px] text-ellipsis whitespace-nowrap text-[#030213]">
              {t('layout.brand')}
            </strong>
          )}
          <button
            className={`hidden cursor-pointer items-center justify-center rounded-md border border-transparent bg-transparent text-[#030213] hover:bg-[#f3f3f5] md:inline-flex ${
              collapsed ? 'h-7 w-7' : 'ml-auto h-8 w-8'
            }`}
            type="button"
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </button>
        </div>
        <nav className={collapsed ? 'px-2 py-4' : 'p-4'}>
          {!collapsed && (
            <div className="mx-1 mt-3 mb-2.5 text-xs font-semibold text-[#717182]">
              {t('layout.section.menu')}
            </div>
          )}
          <div className="grid gap-1">
            {menus.map(collapsed ? renderCollapsedMenu : renderExpandedMenu)}
          </div>
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-[#e4e4e7] bg-white px-3 sm:px-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              className="funlo-mobile-menu-trigger"
              icon={<MenuFoldOutlined />}
              onClick={() => setMobileSidebarOpen(true)}
            />
            <div className="min-w-0">
              <h1 className="!m-0 !mb-0 truncate text-xl leading-none font-semibold text-[#030213] sm:text-2xl">
                {pageTitle}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#030213]">
            <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#030213] font-bold text-white sm:h-10 sm:w-10">
              {userName.slice(0, 1)}
            </div>
            <div className="hidden sm:block">
              <strong>{userName}</strong>
              <span className="mt-0.5 block text-xs text-[#717182]">
                {session.user.role.roleName}
              </span>
            </div>
            <Button icon={<LogoutOutlined />} onClick={logout} />
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ManagerLayout
