import { useRouter } from 'next/navigation'
import { startTransition, useCallback, useState } from 'react'
import { reorderPrograms } from '../actions/program/reorderPrograms'
import { reorderNews } from '../actions/news/reorderNews'
import { reorderNewsletters } from '../actions/newsletter/reorderNewsletters'
import { reorderResources } from '../actions/resource/reorderResources'
import { reorderCampaigns } from '../actions/campaign/reorderCampaigns'
import { reorderClosings } from '../actions/closing/reorderClosings'
import { reorderEvents } from '../actions/event/reorderEvents'
import { InlineMessageState } from '@/components/_shared/InlineMessage'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'

interface ReorderItem {
  id: string
  [key: string]: any
}

type ItemType = 'program' | 'news' | 'newsletter' | 'resource' | 'campaign' | 'closing' | 'event'

const actionMap: Record<ItemType, (items: any[]) => Promise<any>> = {
  program: async (items) => await reorderPrograms(items),
  news: async (items) => await reorderNews(items),
  newsletter: async (items) => await reorderNewsletters(items),
  resource: async (items) => await reorderResources(items),
  campaign: async (items) => await reorderCampaigns(items),
  closing: async (items) => await reorderClosings(items),
  event: async (items) => await reorderEvents(items)
}

const LABELS: Record<ItemType, string> = {
  program: 'Programs',
  news: 'News',
  newsletter: 'Newsletters',
  resource: 'Resources',
  campaign: 'Campaigns',
  closing: 'Closings',
  event: 'Events'
}

export default function useGenericListReorder<T extends ReorderItem>(data: T[], itemType: ItemType) {
  const router = useRouter()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<'top' | 'bottom' | null>(null)
  const [message, setMessage] = useState<InlineMessageState | null>(null)

  const dismissMessage = useCallback(() => setMessage(null), [])

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const midpoint = rect.height / 2
    const offsetY = e.clientY - rect.top

    const currentPosition = offsetY < midpoint ? 'top' : 'bottom'
    setDragPosition(currentPosition)
    setDraggedOver(itemId)
  }

  const handleDragLeave = () => {
    setDraggedOver(null)
    setDragPosition(null)
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()

    if (!draggedItem || draggedItem === targetId) {
      resetDragState()
      return
    }

    const draggedIndex = data.findIndex((item) => item.id === draggedItem)
    const targetIndex = data.findIndex((item) => item.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) {
      resetDragState()
      return
    }

    // Reorder items
    const newList = [...data]
    const [movedItem] = newList.splice(draggedIndex, 1)
    newList.splice(targetIndex, 0, movedItem)

    // Update display order
    const updatedList = newList.map((item, index) => ({
      ...item,
      order: index + 1
    }))

    setMessage(null)

    // Save to backend
    startTransition(async () => {
      try {
        const action = actionMap[itemType]
        const result = await action(updatedList)

        if (!result?.success) {
          setMessage({
            type: 'error',
            message: `Could not reorder ${LABELS[itemType].toLowerCase()}`,
            description: extractErrorMessage(result)
          })
          return
        }

        router.refresh()

        setMessage({
          type: 'success',
          message: `${LABELS[itemType]} reordered successfully`
        })
      } catch (error) {
        setMessage({
          type: 'error',
          message: `Could not reorder ${LABELS[itemType].toLowerCase()}`,
          description: extractErrorMessage(error)
        })
      }
    })

    resetDragState()
  }

  const handleDragEnd = () => {
    resetDragState()
  }

  const resetDragState = () => {
    setDraggedItem(null)
    setDraggedOver(null)
    setDragPosition(null)
  }

  return {
    draggedOver,
    dragPosition,
    message,
    dismissMessage,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  }
}
