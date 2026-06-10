import type { ReactNode } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

type PageCardProps = {
  title: string
  description: string
  actionLabel?: string
  children: ReactNode
  onAction?: () => void
}

function PageCard({
  title,
  description,
  actionLabel,
  children,
  onAction,
}: PageCardProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#e4e4e7] bg-white">
      <div className="flex min-h-[68px] flex-col items-stretch justify-between gap-3 border-b border-[#e4e4e7] px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="min-w-0">
          <h2 className="m-0 text-lg font-semibold text-[#030213]">{title}</h2>
          <p className="mt-1 mb-0 text-[13px] text-[#717182]">{description}</p>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          {actionLabel && onAction && (
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}

export default PageCard
