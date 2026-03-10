import { Archive, ArchiveRestore, Edit2, ExternalLink, GripVertical, Ticket, Trash2, View } from 'lucide-react'
import { deleteCampaign } from '@/app/lib/actions/deleteCampaign'
import { deleteClosing } from '@/app/lib/actions/deleteClosing'
import { deleteNews } from '@/app/lib/actions/deleteNews'
import { deleteNewsletter } from '@/app/lib/actions/deleteNewsletter'
import { deleteProgram } from '@/app/lib/actions/deleteProgram'
import { deleteResource } from '@/app/lib/actions/deleteResource'
import { store } from '@/app/lib/store/store'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { setOpenProgramDrawer } from '@/app/lib/store/slices/programSlice'
import { setOpenNewsDrawer } from '@/app/lib/store/slices/newsSlice'
import { setOpenNewsletterDrawer } from '@/app/lib/store/slices/newsletterSlice'
import { setOpenClubResourceDrawer } from '@/app/lib/store/slices/clubResourceSlice'
import { setOpenCampaignDrawer } from '@/app/lib/store/slices/campaignSlice'
import { setOpenClosingDrawer } from '@/app/lib/store/slices/closingSlice'
import { deleteEvent } from '@/app/lib/actions/deleteEvent'
import { setOpenEventDrawer } from '@/app/lib/store/slices/eventSlice'
import { setOpenTicketDrawer } from '@/app/lib/store/slices/ticketSlice'
import { archiveEvent } from '@/app/lib/actions/archiveEvent'
import { useRouter } from 'next/navigation'
import { unarchiveEvent } from '@/app/lib/actions/unarchiveEvent'
import Link from 'next/link'

export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

const AdminListItem = ({
  item,
  index,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDropWithFeedback,
  handleDragEnd,
  draggedOver,
  dragPosition,
  itemType
}) => {
  const router = useRouter()

  const handleDelete = async () => {
    switch (itemType) {
      case 'newsletter':
        await deleteNewsletter(item.id)
        break
      case 'campaign':
        await deleteCampaign(item.id)
        break
      case 'program':
        await deleteProgram(item.id)
        break
      case 'closing':
        await deleteClosing(item.id)
        break
      case 'club-resource':
        await deleteResource(item.id)
        break
      case 'news':
        await deleteNews(item.id)
        break
      case 'event':
        await deleteEvent(item.id)
        break
    }

    store.dispatch(showToast({ message: `Successfully deleted ${itemType}` }))
  }

  const handleEdit = () => {
    store.dispatch(setInputs({ formName: `${kebabToCamel(itemType)}Form`, data: { ...item, isUpdating: true } }))

    switch (itemType) {
      case 'program':
        store.dispatch(setOpenProgramDrawer())
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
        break
      case 'closing':
        store.dispatch(setOpenClosingDrawer())
        break
      case 'event':
        store.dispatch(setOpenEventDrawer())
        break
    }
  }

  const handleArchive = async (eventId: string) => {
    try {
      if (item.status === 'ARCHIVED') {
        await unarchiveEvent(eventId)
      } else {
        await archiveEvent(eventId)
      }
      router.refresh()
      store.dispatch(
        showToast({
          type: 'success',
          message: `Successfully ${item.status === 'ARCHIVED' ? 'unarchived' : 'archived'} event!`
        })
      )
    } catch {
      store.dispatch(
        showToast({
          type: 'error',
          message: `Failed to ${item.status === 'ARCHIVED' ? 'unarchived' : 'archived'} event`
        })
      )
    }
  }

  return (
    <div
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
          : item.status === 'ARCHIVED'
            ? 'dark:border-purple-900/40 dark:bg-purple-950/10 border-purple-200/60 bg-purple-50/50 opacity-60'
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

      <div className="flex-1 min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium dark:text-neutral-100 text-neutral-900 truncate">
              {item.name || item.title || item.month || 'Unnamed'}
            </h3>
            {item.status === 'ARCHIVED' && (
              <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">
                Archived
              </span>
            )}
          </div>
          <p className="text-xs dark:text-neutral-500 text-neutral-600 truncate">
            {item?.descriptions?.[0] ||
              item.paragraph1 ||
              item.year ||
              item.url ||
              item.description ||
              item.date ||
              'No description'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="shrink-0 flex items-center gap-2">
        {itemType === 'program' && (
          <div className="relative group/view">
            <a
              href={`/programs/${item.id}`}
              target="blank"
              className="block p-2 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded-lg transition-colors"
              title="View program"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/view:opacity-100 transition-opacity pointer-events-none z-50 shadow-sm">
              View
            </div>
          </div>
        )}
        {itemType === 'event' && (
          <div className="relative group/ticket">
            <button
              onClick={() => {
                store.dispatch(setOpenTicketDrawer())
                store.dispatch(setInputs({ formName: 'ticketForm', data: { tickets: item.tickets, eventId: item.id } }))
              }}
              className="relative p-2 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <Ticket className="h-4 w-4" />
              {item.tickets?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-sky-500 text-white text-[9px] font-bold rounded-full">
                  {item.tickets.length}
                </span>
              )}
            </button>
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/ticket:opacity-100 transition-opacity pointer-events-none z-50 shadow-sm">
              Tickets
            </div>
          </div>
        )}
        <div className="relative group/edit">
          <button
            onClick={handleEdit}
            className="p-2 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded-lg transition-colors"
            title="Edit item"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none z-50 shadow-sm">
            Edit
          </div>
        </div>
        {itemType === 'event' ? (
          <div className="relative group/archive">
            <button
              onClick={() => handleArchive(item.id)}
              className={`p-2 dark:hover:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors ${
                item.status === 'ARCHIVED'
                  ? 'text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300'
                  : 'dark:text-neutral-600 dark:hover:text-purple-400 text-neutral-600 hover:text-purple-600'
              }`}
              title={item.status === 'ARCHIVED' ? 'Unarchive event' : 'Archive event'}
            >
              {item.status === 'ARCHIVED' ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            </button>
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/archive:opacity-100 transition-opacity pointer-events-none z-50 shadow-sm">
              {item.status === 'ARCHIVED' ? 'Unarchive' : 'Archive'}
            </div>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="p-2 dark:text-neutral-600 dark:hover:text-red-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-red-600 hover:bg-neutral-200 rounded-lg transition-colors"
            title="Delete item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default AdminListItem
