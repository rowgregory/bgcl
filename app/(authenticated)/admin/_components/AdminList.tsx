'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import useGenericListReorder from '@/lib/hooks/useGenericListReorder'
import {
  useProgramDrawer,
  useNewsDrawer,
  useNewsletterDrawer,
  useResourceDrawer,
  useCampaignDrawer,
  useClosingDrawer
} from '@/stores/drawers'
import AdminListItem from './AdminListItem'
import { InlineMessage } from '@/components/_shared/InlineMessage'
import { AdminPageHeader } from './AdminPageHeader'

const DRAWER_STORES = {
  program: useProgramDrawer,
  news: useNewsDrawer,
  newsletter: useNewsletterDrawer,
  resource: useResourceDrawer,
  campaign: useCampaignDrawer,
  closing: useClosingDrawer
} as const

interface ListItem {
  id: string
  order?: number
  [key: string]: any
}

interface AdminListPageProps<T extends ListItem> {
  data: T[]
  pageTitle: string
  itemType: 'program' | 'news' | 'newsletter' | 'resource' | 'campaign' | 'closing' | 'event'
  emptyMessage?: string
}

export function AdminListPage<T extends ListItem>({ data, pageTitle, itemType, emptyMessage }: AdminListPageProps<T>) {
  const router = useRouter()
  const items = data ?? []

  const {
    draggedOver,
    dragPosition,
    message,
    dismissMessage,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useGenericListReorder(items, itemType)

  // Clear a success message on its own; errors stay until dismissed or the next drop
  useEffect(() => {
    if (message?.type !== 'success') return

    const timer = setTimeout(() => dismissMessage(), 2500)
    return () => clearTimeout(timer)
  }, [message, dismissMessage])

  const handleCreate = () => {
    if (itemType === 'event') return router.push('/admin/events/events/new')
    DRAWER_STORES[itemType]?.getState().open()
  }

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white">
      <AdminPageHeader
        title={pageTitle}
        meta={items.length > 0 ? `${items.length} ${itemType}${items.length === 1 ? '' : 's'}` : undefined}
        actions={
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add {itemType}
          </button>
        }
      />

      <div className="px-6 py-6 lg:px-8">
        <InlineMessage state={message} onDismiss={dismissMessage} className="mb-4" />

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-neutral-400 dark:text-neutral-600">{emptyMessage ?? `No ${itemType}s yet.`}</p>
            <button
              type="button"
              onClick={handleCreate}
              className="mt-3 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              Add the first one
            </button>
          </div>
        ) : (
          <>
            {items.length > 1 && (
              <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-3">
                Drag to reorder. Changes save automatically.
              </p>
            )}

            <div className="space-y-2">
              {items.map((item, index) => (
                <AdminListItem
                  key={item.id ?? index}
                  dragPosition={dragPosition}
                  draggedOver={draggedOver}
                  handleDragEnd={handleDragEnd}
                  handleDragLeave={handleDragLeave}
                  handleDragOver={handleDragOver}
                  handleDragStart={handleDragStart}
                  handleDropWithFeedback={handleDrop}
                  index={index}
                  item={item}
                  itemType={itemType}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
