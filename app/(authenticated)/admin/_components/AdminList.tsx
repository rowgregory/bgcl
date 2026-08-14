'use client'

import useGenericListReorder from '@/lib/hooks/useGenericListReorder'
import {
  useProgramDrawer,
  useNewsDrawer,
  useNewsletterDrawer,
  useResourceDrawer,
  useCampaignDrawer,
  useClosingDrawer
} from '@/stores/drawers'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import AdminListItem from './AdminListItem'
import { useRouter } from 'next/navigation'
import { InlineMessage } from '@/components/_shared/InlineMessage'

interface AdminListItem {
  id: string
  order?: number
  [key: string]: any
}

interface AdminListPageProps<T extends AdminListItem> {
  data: T[] | any
  pageTitle: string
  itemType: 'program' | 'news' | 'newsletter' | 'resource' | 'campaign' | 'closing' | 'event'
  emptyMessage?: string
}

export function AdminListPage<T extends AdminListItem>({
  data,
  pageTitle,
  itemType,
  emptyMessage = 'No items added yet'
}: AdminListPageProps<T>) {
  const router = useRouter()

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
  } = useGenericListReorder(data, itemType)

  // Clear a success message on its own; errors stay until dismissed or the next drop
  useEffect(() => {
    if (message?.type !== 'success') return

    const timer = setTimeout(() => dismissMessage(), 2500)
    return () => clearTimeout(timer)
  }, [message, dismissMessage])

  const handleCreate = () => {
    switch (itemType) {
      case 'program':
        useProgramDrawer.getState().open()
        break
      case 'news':
        useNewsDrawer.getState().open()
        break
      case 'newsletter':
        useNewsletterDrawer.getState().open()
        break
      case 'resource':
        useResourceDrawer.getState().open()
        break
      case 'campaign':
        useCampaignDrawer.getState().open()
        break
      case 'closing':
        useClosingDrawer.getState().open()
        break
      case 'event':
        router.push('/admin/events/events/new')
        break
    }
  }

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white p-6 md:p-8">
      <div className="w-full space-y-12">
        <div className="mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold dark:text-neutral-100 text-neutral-900">{pageTitle}</h2>
              <p className="mt-1 text-sm dark:text-neutral-400 text-neutral-600">
                Drag to reorder. Changes save automatically.
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="p-1.5 dark:hover:bg-neutral-800 hover:bg-neutral-100 rounded transition-colors shrink-0"
              title={`Add ${itemType}`}
            >
              <Plus className="w-4 h-4 dark:text-neutral-500 text-neutral-500" />
            </button>
          </div>
        </div>

        <InlineMessage state={message} onDismiss={dismissMessage} className="mb-6" />

        <div className="space-y-2">
          {data?.length === 0 ? (
            <div className="rounded-lg dark:bg-neutral-900 dark:text-neutral-400 bg-neutral-100 text-neutral-600 px-6 py-12 text-center">
              <p className="text-sm">{emptyMessage}</p>
            </div>
          ) : (
            data?.map((item, index) => (
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
            ))
          )}
        </div>

        {data?.length > 0 && (
          <div className="mt-8 text-xs dark:text-neutral-500 text-neutral-600">
            <p>
              Total: {data?.length} {itemType}
              {data?.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
