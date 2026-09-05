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

const EVENT_STATUS_DOT: Record<string, string> = {
  UPCOMING: 'bg-sky-500',
  ONGOING: 'bg-emerald-500',
  COMPLETED: 'bg-neutral-300 dark:bg-neutral-700',
  CANCELLED: 'bg-red-500',
  POSTPONED: 'bg-amber-500',
  ARCHIVED: 'bg-neutral-300 dark:bg-neutral-700'
}

const actionCls =
  'p-1.5 rounded text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'

/** First non-empty descriptive field, whatever the entity happens to call it. */
function getSubtitle(item: any): string {
  return (
    item?.descriptions?.[0] ||
    item.paragraph1 ||
    item.year ||
    item.url ||
    item.description ||
    (item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null) ||
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

  // The drop indicator is the only place a row gets a heavy border
  const dropClasses =
    draggedOver === item.id
      ? dragPosition === 'top'
        ? 'border-t-2 border-t-sky-500'
        : 'border-b-2 border-b-sky-500'
      : 'border-b border-neutral-100 dark:border-neutral-900'

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, item.id)}
      onDragOver={(e) => handleDragOver(e, item.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDropWithFeedback(e, item.id)}
      onDragEnd={handleDragEnd}
      className={`group relative flex items-center gap-3 px-2 py-3 cursor-move transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50 ${dropClasses} ${
        isArchived ? 'opacity-50' : ''
      }`}
    >
      <GripVertical
        className="h-4 w-4 shrink-0 text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors"
        aria-hidden="true"
      />

      <span className="shrink-0 w-6 text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">{index + 1}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm text-neutral-900 dark:text-white truncate">
            {item.name || item.title || item.month || 'Unnamed'}
          </h3>
          {isArchived && <span className="shrink-0 text-xs text-neutral-400 dark:text-neutral-600">Archived</span>}
        </div>
        <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-600 truncate">{getSubtitle(item)}</p>
      </div>

      {isEvent && item.status && (
        <span className="shrink-0 hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${EVENT_STATUS_DOT[item.status] ?? 'bg-neutral-300 dark:bg-neutral-700'}`}
            aria-hidden="true"
          />
          {item.status.toLowerCase().replace(/_/g, ' ')}
        </span>
      )}

      {/* Actions, revealed on hover but always reachable by keyboard */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {config.publicPath && (
          <a
            href={config.publicPath(item.id)}
            target="_blank"
            rel="noopener noreferrer"
            className={actionCls}
            aria-label={`View ${itemType}`}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}

        <button type="button" onClick={handleEdit} disabled={isBusy} className={actionCls} aria-label={`Edit ${itemType}`}>
          <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        {isEvent ? (
          <button
            type="button"
            onClick={handleArchive}
            disabled={isBusy}
            className={actionCls}
            aria-label={isArchived ? 'Unarchive event' : 'Archive event'}
          >
            {isArchived ? (
              <ArchiveRestore className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Archive className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isBusy}
            className={`${actionCls} hover:text-red-600 dark:hover:text-red-400`}
            aria-label={`Delete ${itemType}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
