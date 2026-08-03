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
import { AlertCircle, Check, Plus } from 'lucide-react'
import { useState } from 'react'
import AdminListItem from './AdminListItem'
import { useRouter } from 'next/navigation'

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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()

  const { draggedOver, dragPosition, handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } =
    useGenericListReorder(data, itemType)

  const handleDropWithFeedback = async (e: React.DragEvent, targetId: string) => {
    setSaveStatus('saving')
    setErrorMessage('')

    try {
      await handleDrop(e, targetId)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save order')
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

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

        {/* Status Messages */}
        {saveStatus === 'success' && (
          <div className="mb-6 flex items-center gap-3 rounded-lg dark:bg-sky-950/40 dark:border-sky-800/50 dark:text-sky-200 bg-sky-100/50 border-sky-300/50 text-sky-900 px-4 py-3 border">
            <Check className="h-5 w-5 dark:text-sky-400 text-sky-600" />
            <span className="text-sm">Saved successfully</span>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mb-6 flex items-center gap-3 rounded-lg dark:bg-red-950/40 dark:border-red-800/50 dark:text-red-200 bg-red-100/50 border-red-300/50 text-red-900 px-4 py-3 border">
            <AlertCircle className="h-5 w-5 dark:text-red-400 text-red-600" />
            <span className="text-sm">{errorMessage || 'Failed to save'}</span>
          </div>
        )}

        <div className="space-y-2">
          {data?.length === 0 ? (
            <div className="rounded-lg dark:bg-neutral-900 dark:text-neutral-400 bg-neutral-100 text-neutral-600 px-6 py-12 text-center">
              <p className="text-sm">{emptyMessage}</p>
            </div>
          ) : (
            data?.map((item, index) => (
              <AdminListItem
                key={index}
                dragPosition={dragPosition}
                draggedOver={draggedOver}
                handleDragEnd={handleDragEnd}
                handleDragLeave={handleDragLeave}
                handleDragOver={handleDragOver}
                handleDragStart={handleDragStart}
                handleDropWithFeedback={handleDropWithFeedback}
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
