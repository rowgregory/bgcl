import { useRouter } from 'next/navigation'
import { startTransition, useCallback, useState } from 'react'
import { reorderTeamMembers } from '../actions/team-member/reorderTeamMembers'
import { InlineMessageState } from '@/components/_shared/InlineMessage'
import extractErrorMessage from '@/lib/utils/extractErrorMessage'

export default function useTeamMemberList(data: any, role: string) {
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

    setMessage(null)

    // Save to backend
    startTransition(async () => {
      try {
        const result = await reorderTeamMembers(role, updatedList)

        if (result && result.success === false) {
          setMessage({
            type: 'error',
            message: 'Could not reorder team members',
            description: extractErrorMessage(result)
          })
          return
        }

        router.refresh()

        setMessage({
          type: 'success',
          message: 'Team member order updated successfully'
        })
      } catch (error) {
        setMessage({
          type: 'error',
          message: 'Could not reorder team members',
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
