import { Edit2, GripVertical, Ticket, Trash2 } from 'lucide-react'
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
        {' '}
        <div>
          <h3 className="text-sm font-medium dark:text-neutral-100 text-neutral-900 truncate">
            {item.name || item.title || item.month || 'Unnamed'}
          </h3>
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
        {itemType === 'event' && (
          <button
            onClick={() => store.dispatch(setOpenTicketDrawer())}
            className="p-2 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded-lg transition-colors"
            title="Edit item"
          >
            <Ticket className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={handleEdit}
          className="p-2 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded-lg transition-colors"
          title="Edit item"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 dark:text-neutral-600 dark:hover:text-red-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-red-600 hover:bg-neutral-200 rounded-lg transition-colors"
          title="Delete item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default AdminListItem
