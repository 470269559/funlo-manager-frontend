import { Card, Empty } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { API_BASE_URL } from '../../../../services/request'
import { t } from '../../../../locales'
import type { MenuItem } from '../../../../types/system'
import { flattenMenus } from '../../../../utils/menu'

type DashboardPageProps = {
  menus: MenuItem[]
}

const metricCardClass =
  'grid min-h-24 content-between gap-[18px] rounded-lg border border-[#e4e4e7] bg-white p-4'

function DashboardPage({ menus }: DashboardPageProps) {
  const menuCount = flattenMenus(menus).length
  const metrics = [
    {
      label: t('system.dashboard.currentModule'),
      value: t('system.dashboard.moduleName'),
    },
    {
      label: t('system.dashboard.authStatus'),
      value: t('system.dashboard.jwtEnabled'),
    },
    {
      label: t('system.dashboard.visibleMenus'),
      value: menuCount,
    },
    {
      label: t('system.dashboard.apiBaseUrl'),
      value: API_BASE_URL.replace(/^https?:\/\//, ''),
    },
  ]

  return (
    <div className="grid gap-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div className={metricCardClass} key={metric.label}>
            <span className="text-[#717182]">{metric.label}</span>
            <strong className="min-w-0 overflow-hidden text-[22px] text-ellipsis whitespace-nowrap text-[#030213]">
              {metric.value}
            </strong>
          </div>
        ))}
      </section>
      <Card
        className="min-h-[360px]"
        title={
          <span className="inline-flex items-center gap-2.5">
            <SettingOutlined />
            {t('system.dashboard.overview')}
          </span>
        }
      >
        <div className="grid min-h-[280px] place-items-center">
          <Empty description={t('system.dashboard.empty')} />
        </div>
      </Card>
    </div>
  )
}

export default DashboardPage
