import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { t } from '../../../locales'
import { ROUTE_PATHS } from '../../../routes/paths'
import { login } from '../../../services/authService'
import { useAuthStore } from '../../../stores/authStore'
import { getFirstMenuPath } from '../../../utils/menu'

function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError('')

    try {
      const result = await login({ username, password })
      const menus = await setSession(result)
      navigate(getFirstMenuPath(menus, ROUTE_PATHS.dashboard), {
        replace: true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f7f7f8] lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]">
      <section
        className="flex min-h-[260px] flex-col justify-center bg-cover bg-center p-9 text-white lg:p-[72px]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(3, 2, 19, 0.45), rgba(3, 2, 19, 0.52)), url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=80")',
        }}
      >
        <div className="grid h-[52px] w-[52px] place-items-center rounded-lg bg-[#030213] text-[26px] font-extrabold text-white">
          F
        </div>
        <h1 className="mt-[22px] mb-2 text-[44px] leading-[1.1] font-bold">
          {t('auth.title')}
        </h1>
        <p className="m-0 text-base text-white/80">{t('auth.subtitle')}</p>
      </section>
      <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-[440px] rounded-lg border border-[#e4e4e7] bg-white p-6 shadow-[0_16px_40px_rgba(3,2,19,0.08)] sm:p-7">
          <Form
            layout="vertical"
            className="flex flex-col gap-[18px]"
            onFinish={() => void handleSubmit()}
          >
            <div>
              <p className="mt-0 mb-1.5 text-xs font-bold tracking-[0.08em] text-[#4b5563] uppercase">
                {t('auth.login')}
              </p>
              <h2 className="m-0 text-2xl font-semibold text-[#030213]">
                {t('auth.welcome')}
              </h2>
            </div>
            <Form.Item className="mb-0" label={t('auth.username')} required>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
            <Form.Item className="mb-0" label={t('auth.password')} required>
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            {error && (
              <div className="mt-3 text-[13px] text-[#d4183d]">{error}</div>
            )}
            <Button
              htmlType="submit"
              loading={loading}
              type="primary"
            >
              {loading ? t('auth.submitting') : t('auth.submit')}
            </Button>
          </Form>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
