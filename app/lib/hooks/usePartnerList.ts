import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { store } from '../store/store'
import { showToast } from '../store/slices/toastSlice'
import { reorderPartners } from '../actions/reorderPartners'

export default function usePartnerList(data: any, tier: string) {
  const router = useRouter()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<'top' | 'bottom' | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, partnerId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const midpoint = rect.height / 2
    const offsetY = e.clientY - rect.top

    const currentPosition = offsetY < midpoint ? 'top' : 'bottom'
    setDragPosition(currentPosition)
    setDraggedOver(partnerId)
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

    const draggedIndex = data.findIndex((tier) => tier.id === draggedItem)
    const targetIndex = data.findIndex((tier) => tier.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) {
      resetDragState()
      return
    }

    // Reorder items
    const newList = [...data]
    const [movedItem] = newList.splice(draggedIndex, 1)
    newList.splice(targetIndex, 0, movedItem)

    // Update display order
    const updatedList = newList.map((tier, index) => ({
      ...tier,
      order: index + 1
    }))

    // Save to backend
    startTransition(async () => {
      try {
        await reorderPartners(tier, updatedList)

        router.refresh()
        store.dispatch(
          showToast({
            message: 'Partner tiers order updated successfully!',
            type: 'success'
          })
        )
      } catch (error) {
        store.dispatch(
          showToast({
            message: error instanceof Error ? error.message : 'Failed to update tier',
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

  return { draggedOver, dragPosition, handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd }
}
