'use client'

import { deleteCampaign } from '@/app/lib/actions/deleteCampaign'
import { deleteClosing } from '@/app/lib/actions/deleteClosing'
import { deleteNewsletter } from '@/app/lib/actions/deleteNewsletter'
import { deleteProgram } from '@/app/lib/actions/deleteProgram'
import useGenericListReorder from '@/app/lib/hooks/useGenericListReorder'
import { initialCampaignFormState } from '@/app/lib/initial-states/campaign'
import { initialClosingFormState } from '@/app/lib/initial-states/closing'
import { initialProgramFormState } from '@/app/lib/initial-states/program'
import { setOpenCampaignDrawer } from '@/app/lib/store/slices/campaignSlice'
import { setOpenClosingDrawer } from '@/app/lib/store/slices/closingSlice'
import { setOpenClubResourceDrawer } from '@/app/lib/store/slices/clubResourceSlice'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { setOpenNewsletterDrawer } from '@/app/lib/store/slices/newsletterSlice'
import { setOpenNewsDrawer } from '@/app/lib/store/slices/newsSlice'
import { setOpenProgramDrawer } from '@/app/lib/store/slices/programSlice'
import { store } from '@/app/lib/store/store'
import { AlertCircle, Check, Edit2, GripVertical, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface AdminListItem {
  id: string
  order?: number
  [key: string]: any
}

interface AdminListPageProps<T extends AdminListItem> {
  data: T[]
  pageTitle: string
  itemType: 'program' | 'news' | 'newsletter' | 'club-resource' | 'campaign' | 'closing'
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

  const { draggedOver, dragPosition, handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } =
    useGenericListReorder(data, itemType)

  const renderItemContent = (item: T) => {
    return (
      <div>
        <h3 className="text-sm font-medium dark:text-neutral-100 text-neutral-900 truncate">
          {item.name || item.title || item.month || 'Unnamed'}
        </h3>
        <p className="text-xs dark:text-neutral-500 text-neutral-600 truncate">
          {item.description1 ||
            item.paragraph1 ||
            item.year ||
            item.url ||
            item.description ||
            item.date ||
            'No description'}
        </p>
      </div>
    )
  }

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

  const handleEdit = (item: T) => {
    store.dispatch(setInputs({ formName: `${itemType}Form`, data: { ...item, isUpdating: true } }))
    if (itemType === 'program') {
      store.dispatch(setOpenProgramDrawer())
    } else if (itemType === 'news') {
      store.dispatch(setOpenNewsDrawer())
    } else if (itemType === 'newsletter') {
      store.dispatch(setOpenNewsletterDrawer())
    } else if (itemType === 'club-resource') {
      store.dispatch(setOpenClubResourceDrawer())
    } else if (itemType === 'campaign') {
      store.dispatch(setOpenCampaignDrawer())
    } else if (itemType === 'closing') {
      store.dispatch(setOpenClosingDrawer())
    }
  }

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white p-6 md:p-8">
      <div className="w-full space-y-12">
        <div className="space-y-8">
          <div className="w-full">
            <div className="mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold dark:text-neutral-100 text-neutral-900">{pageTitle}</h2>
                  <p className="mt-1 text-sm dark:text-neutral-400 text-neutral-600">
                    Drag to reorder. Changes save automatically.
                  </p>
                </div>
                <button
                  onClick={() => {
                    switch (itemType) {
                      case 'program':
                        store.dispatch(setOpenProgramDrawer())
                        store.dispatch(setInputs({ formName: 'programForm', data: initialProgramFormState }))
                        break
                      case 'news':
                        store.dispatch(setOpenNewsDrawer())
                        break
                      case 'newsletter':
                        store.dispatch(setOpenNewsletterDrawer())
                        break
                      case 'club-resource':
                        store.dispatch(setOpenClubResourceDrawer())
                        break
                      case 'campaign':
                        store.dispatch(setOpenCampaignDrawer())
                        store.dispatch(setInputs({ formName: 'campaignForm', data: initialCampaignFormState }))
                        break
                      case 'closing':
                        store.dispatch(setOpenClosingDrawer())
                        store.dispatch(setInputs({ formName: 'closingForm', data: initialClosingFormState }))
                        break
                    }
                  }}
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
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDropWithFeedback(e, item.id)}
                    onDragEnd={handleDragEnd}
                    className={`group relative flex items-center gap-4 rounded-lg border transition-all duration-200 ${
                      draggedOver === item.id
                        ? dragPosition === 'top'
                          ? 'dark:border-sky-500/50 dark:bg-sky-950/20 border-t-2 dark:border-t-sky-500 border-t-sky-500'
                          : 'dark:border-sky-500/50 dark:bg-sky-950/20 border-b-2 dark:border-b-sky-500 border-b-sky-500'
                        : 'dark:border-neutral-800/50 dark:bg-neutral-900/50 dark:hover:border-neutral-700/50 border-neutral-300/50 bg-neutral-50 hover:border-neutral-400/50'
                    } cursor-move px-4 py-4 md:px-6`}
                  >
                    <div className="shrink-0 dark:text-neutral-600 dark:group-hover:text-sky-400 text-neutral-400 group-hover:text-sky-600 transition-colors">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="shrink-0 w-8">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full dark:bg-neutral-800 dark:text-sky-200 bg-neutral-200 text-sky-700 text-xs font-medium">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">{renderItemContent(item)}</div>

                    {/* Action Buttons */}
                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded-lg transition-colors"
                        title="Edit item"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (itemType === 'newsletter') {
                            await deleteNewsletter(item.id)
                          } else if (itemType === 'campaign') {
                            await deleteCampaign(item.id)
                          } else if (itemType === 'program') {
                            await deleteProgram(item.id)
                          } else if (itemType === 'closing') {
                            await deleteClosing(item.id)
                          }
                        }}
                        className="p-2 dark:text-neutral-600 dark:hover:text-red-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-red-600 hover:bg-neutral-200 rounded-lg transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
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
      </div>
    </div>
  )
}
