import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { store } from '../store/store'
import { showToast } from '../store/slices/toastSlice'
import { updateTeamMembersOrder } from '../actions/updateTeamMemberOrder'

export default function useTeamMemberList(data: any, role: string) {
  const router = useRouter()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<'top' | 'bottom' | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, teamMemberId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const midpoint = rect.height / 2
    const offsetY = e.clientY - rect.top

    const currentPosition = offsetY < midpoint ? 'top' : 'bottom'
    setDragPosition(currentPosition)
    setDraggedOver(teamMemberId)
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

    const draggedIndex = data.findIndex((member) => member.id === draggedItem)
    const targetIndex = data.findIndex((member) => member.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) {
      resetDragState()
      return
    }

    // Reorder items
    const newList = [...data]
    const [movedItem] = newList.splice(draggedIndex, 1)
    newList.splice(targetIndex, 0, movedItem)

    // Update display order
    const updatedList = newList.map((member, index) => ({
      ...member,
      displayOrder: index + 1
    }))

    // Save to backend
    startTransition(async () => {
      try {
        await updateTeamMembersOrder(role, updatedList)

        router.refresh()
        store.dispatch(
          showToast({
            message: 'Team members order updated successfully!',
            type: 'success'
          })
        )
      } catch (error) {
        store.dispatch(
          showToast({
            message: error instanceof Error ? error.message : 'Failed to update team member',
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
