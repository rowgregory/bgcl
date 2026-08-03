'use client'

import { useState } from 'react'
import { Archive, ArchiveRestore, Edit2, ExternalLink, GripVertical, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { deleteCampaign } from '@/lib/actions/campaign/deleteCampaign'
import { deleteClosing } from '@/lib/actions/closing/deleteClosing'
import { deleteNewsletter } from '@/lib/actions/newsletter/deleteNewsletter'
import { deleteResource } from '@/lib/actions/resource/deleteResource'
import { deleteProgram } from '@/lib/actions/program/deleteProgram'
import { deleteNews } from '@/lib/actions/news/deleteNews'
import { deletePartner } from '@/lib/actions/partner/deletePartner'
import { archiveEvent } from '@/lib/actions/event/archiveEvent'
import { unarchiveEvent } from '@/lib/actions/event/unarchiveEvent'

import {
  useCampaignDrawer,
  useClosingDrawer,
  useNewsDrawer,
  useNewsletterDrawer,
  useResourceDrawer,
  useProgramDrawer,
  usePartnerDrawer,
  useEventDrawer
} from '@/stores/drawers'

type ItemType = 'program' | 'news' | 'newsletter' | 'resource' | 'campaign' | 'closing' | 'event' | 'partner'

/**
 * One entry per entity: how to delete it, how to open its edit drawer, and
 * (optionally) where its public page lives. Adding an entity means adding a
 * row here rather than editing three switch statements.
 */
const ITEM_CONFIG: Record<
  ItemType,
  {
    delete: (id: string) => Promise<unknown>
    openDrawer: (item: any) => void
    publicPath?: (id: string) => string
  }
> = {
  program: {
    delete: deleteProgram,
    openDrawer: (item) => useProgramDrawer.getState().open(item),
    publicPath: (id) => `/programs/${id}`
  },
  news: {
    delete: deleteNews,
    openDrawer: (item) => useNewsDrawer.getState().open(item)
  },
  newsletter: {
    delete: deleteNewsletter,
    openDrawer: (item) => useNewsletterDrawer.getState().open(item)
  },
  resource: {
    delete: deleteResource,
    openDrawer: (item) => useResourceDrawer.getState().open(item)
  },
  campaign: {
    delete: deleteCampaign,
    openDrawer: (item) => useCampaignDrawer.getState().open(item)
  },
  closing: {
    delete: deleteClosing,
    openDrawer: (item) => useClosingDrawer.getState().open(item)
  },
  partner: {
    delete: deletePartner,
    openDrawer: (item) => usePartnerDrawer.getState().open(item)
  },
  event: {
    delete: async () => {}, // events archive rather than delete
    openDrawer: (item) => useEventDrawer.getState().open(item),
    publicPath: (id) => `/events/${id}`
  }
}

const EVENT_STATUS_STYLES: Record<string, string> = {
  UPCOMING: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400',
  ONGOING: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
  COMPLETED: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400',
  CANCELLED: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
  POSTPONED: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  ARCHIVED: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
}

const DEFAULT_STATUS_STYLE = 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'

/** First non-empty descriptive field, whatever the entity happens to call it. */
function getSubtitle(item: any): string {
  return (
    item?.descriptions?.[0] ||
    item.paragraph1 ||
    item.year ||
    item.url ||
    item.description ||
    (item.date
      ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : null) ||
    item.tier ||
    'No description'
  )
}

interface AdminListItemProps {
  item: any
  index: number
  itemType: ItemType
  draggedOver: string | null
  dragPosition: 'top' | 'bottom' | null
  handleDragStart: (e: React.DragEvent, id: string) => void
  handleDragOver: (e: React.DragEvent, id: string) => void
  handleDragLeave: () => void
  handleDropWithFeedback: (e: React.DragEvent, id: string) => void
  handleDragEnd: () => void
  onError?: (message: string) => void
}

export default function AdminListItem({
  item,
  index,
  itemType,
  draggedOver,
  dragPosition,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDropWithFeedback,
  handleDragEnd,
  onError
}: AdminListItemProps) {
  const router = useRouter()
  const [isBusy, setIsBusy] = useState(false)

  const config = ITEM_CONFIG[itemType]
  const isEvent = itemType === 'event'
  const isArchived = item.status === 'ARCHIVED'

  const handleDelete = async () => {
    setIsBusy(true)
    try {
      await config.delete(item.id)
      router.refresh()
    } catch {
      onError?.(`Failed to delete ${itemType}`)
    } finally {
      setIsBusy(false)
    }
  }

  const handleEdit = () => {
    if (isEvent) {
      router.push(`/admin/events/events/${item.id}`)
      return
    }
    config.openDrawer(item)
  }

  const handleArchive = async () => {
    setIsBusy(true)
    try {
      await (isArchived ? unarchiveEvent(item.id) : archiveEvent(item.id))
      router.refresh()
    } catch {
      onError?.(`Failed to ${isArchived ? 'unarchive' : 'archive'} event`)
    } finally {
      setIsBusy(false)
    }
  }

  const dragClasses =
    draggedOver === item.id
      ? dragPosition === 'top'
        ? 'dark:border-sky-500/50 dark:bg-sky-950/20 border-t-2 dark:border-t-sky-500 border-t-sky-500'
        : 'dark:border-sky-500/50 dark:bg-sky-950/20 border-b-2 dark:border-b-sky-500 border-b-sky-500'
      : isArchived
        ? 'dark:border-purple-900/40 dark:bg-purple-950/10 border-purple-200/60 bg-purple-50/50 opacity-60'
        : 'dark:border-neutral-800/50 dark:bg-neutral-900/50 dark:hover:border-neutral-700/50 border-neutral-300/50 bg-neutral-50 hover:border-neutral-400/50'

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, item.id)}
      onDragOver={(e) => handleDragOver(e, item.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDropWithFeedback(e, item.id)}
      onDragEnd={handleDragEnd}
      className={`group relative flex items-center gap-4 rounded-lg border transition-all duration-200 ${dragClasses} cursor-move px-4 py-4 md:px-6`}
    >
      <div className="shrink-0 dark:text-neutral-600 dark:group-hover:text-sky-400 text-neutral-400 group-hover:text-sky-600 transition-colors">
        <GripVertical className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="shrink-0 w-8">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full dark:bg-neutral-800 dark:text-sky-200 bg-neutral-200 text-sky-700 text-xs font-medium">
          {index + 1}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium dark:text-neutral-100 text-neutral-900 truncate">
            {item.name || item.title || item.month || 'Unnamed'}
          </h3>
          {isArchived && (
            <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">
              Archived
            </span>
          )}
        </div>
        <p className="text-xs dark:text-neutral-500 text-neutral-600 truncate">{getSubtitle(item)}</p>
      </div>

      {isEvent && (
        <div className="shrink-0">
          <span
            className={`inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded ${
              EVENT_STATUS_STYLES[item.status] ?? DEFAULT_STATUS_STYLE
            }`}
          >
            {item.status?.replace(/_/g, ' ')}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="shrink-0 flex items-center gap-2">
        {config.publicPath && (
          <div className="relative group/view">
            <a
              href={config.publicPath(item.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded-lg transition-colors"
              title={`View ${itemType}`}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/view:opacity-100 transition-opacity pointer-events-none z-50 shadow-sm">
              View
            </div>
          </div>
        )}

        <div className="relative group/edit">
          <button
            onClick={handleEdit}
            disabled={isBusy}
            className="p-2 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-40"
            title="Edit item"
          >
            <Edit2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none z-50 shadow-sm">
            Edit
          </div>
        </div>

        {isEvent ? (
          <div className="relative group/archive">
            <button
              onClick={handleArchive}
              disabled={isBusy}
              className={`p-2 dark:hover:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-40 ${
                isArchived
                  ? 'text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300'
                  : 'dark:text-neutral-600 dark:hover:text-purple-400 text-neutral-600 hover:text-purple-600'
              }`}
              title={isArchived ? 'Unarchive event' : 'Archive event'}
            >
              {isArchived ? (
                <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Archive className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/archive:opacity-100 transition-opacity pointer-events-none z-50 shadow-sm">
              {isArchived ? 'Unarchive' : 'Archive'}
            </div>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            disabled={isBusy}
            className="p-2 dark:text-neutral-600 dark:hover:text-red-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-red-600 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-40"
            title="Delete item"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
