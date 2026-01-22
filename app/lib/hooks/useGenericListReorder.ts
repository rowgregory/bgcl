import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { updateProgramsOrder } from '../actions/updateProgramsOrder'
import { store } from '../store/store'
import { showToast } from '../store/slices/toastSlice'
import { updateNewsOrder } from '../actions/updateNewsOrder'
import { updateNewslettersOrder } from '../actions/updateNewslettersOrder'
import { updateClubResourcesOrder } from '../actions/updateClubResourcesOrder'
import { updateCampaignsOrder } from '../actions/updateCampaignsOrder'
import { updateClosingsOrder } from '../actions/updateClosingsOrder'

interface ReorderItem {
  id: string
  [key: string]: any
}

type ItemType = 'program' | 'news' | 'newsletter' | 'club-resource' | 'campaign' | 'closing'

const actionMap: Record<ItemType, (items: any[]) => Promise<any>> = {
  program: async (items) => await updateProgramsOrder(items),
  news: async (items) => await updateNewsOrder(items),
  newsletter: async (items) => await updateNewslettersOrder(items),
  'club-resource': async (items) => await updateClubResourcesOrder(items),
  campaign: async (items) => await updateCampaignsOrder(items),
  closing: async (items) => await updateClosingsOrder(items)
}

export default function useGenericListReorder<T extends ReorderItem>(data: T[], itemType: ItemType) {
  const router = useRouter()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<'top' | 'bottom' | null>(null)

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

    // Save to backend
    startTransition(async () => {
      try {
        const action = actionMap[itemType]
        const result = await action(updatedList)

        if (!result.success) {
          throw new Error(result.error || 'Failed to reorder items')
        }

        router.refresh()

        store.dispatch(
          showToast({
            message: `${itemType} updated successfully!`,
            type: 'success'
          })
        )
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : `Failed to update ${itemType}`

        store.dispatch(
          showToast({
            message: errorMessage,
            type: 'error'
          })
        )
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
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  }
}
