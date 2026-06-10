import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ManagerLayout from './layout/ManagerLayout'
import LoginPage from './features/auth/components/LoginPage'
import DashboardPage from './features/system/dashboard/components/DashboardPage'
import DictionariesPage from './features/system/dictionaries/components/DictionariesPage'
import MenusPage from './features/system/menus/components/MenusPage'
import RolesPage from './features/system/roles/components/RolesPage'
import UsersPage from './features/system/users/components/UsersPage'
import { t } from './locales'
import { ROUTE_PATHS } from './routes/paths'
import { useAuthStore } from './stores/authStore'
import { getFirstMenuPath } from './utils/menu'

function App() {
  const booting = useAuthStore((state) => state.booting)
  const bootstrap = useAuthStore((state) => state.bootstrap)
  const menus = useAuthStore((state) => state.menus)
  const session = useAuthStore((state) => state.session)
  const defaultPath = getFirstMenuPath(menus, ROUTE_PATHS.dashboard)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f7f8] font-bold text-[#030213]">
        {t('app.boot')}
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path={ROUTE_PATHS.login}
        element={
          session ? (
            <Navigate replace to={defaultPath} />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/"
        element={
          session ? (
            <ManagerLayout />
          ) : (
            <Navigate replace to={ROUTE_PATHS.login} />
          )
        }
      >
        <Route index element={<Navigate replace to={defaultPath} />} />
        <Route path="dashboard" element={<DashboardPage menus={menus} />} />
        <Route path="system">
          <Route index element={<Navigate replace to={defaultPath} />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="menus" element={<MenusPage />} />
          <Route path="dictionaries" element={<DictionariesPage />} />
        </Route>
      </Route>
      <Route
        path="*"
        element={
          <Navigate
            replace
            to={session ? defaultPath : ROUTE_PATHS.login}
          />
        }
      />
    </Routes>
  )
}

export default App
