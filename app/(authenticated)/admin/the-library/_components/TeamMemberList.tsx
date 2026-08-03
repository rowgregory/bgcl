'use client'

import { FC, useState } from 'react'
import { GripVertical, Check, AlertCircle, Edit2, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useTeamMemberList from '@/lib/hooks/useTeamMemberList'
import { deleteTeamMember } from '@/lib/actions/team-member/deleteTeamMember'
import { useTeamMemberDrawer } from '@/stores/drawers'
import type { TeamMemberRole } from '@/lib/validations/team-member.validation'
import { TeamMemberRecord } from '@/types/team-member.types'

interface TeamMemberListProps {
  data: TeamMemberRecord[]
  role: TeamMemberRole
  roleLabel: string
}

export const TeamMemberList: FC<TeamMemberListProps> = ({ data, role, roleLabel }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const openDrawer = useTeamMemberDrawer((s) => s.open)

  const { draggedOver, handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } =
    useTeamMemberList(data, role)

  const flashError = (message: string) => {
    setErrorMessage(message)
    setSaveStatus('error')
    setTimeout(() => setSaveStatus('idle'), 3000)
  }

  const handleDropWithFeedback = async (e: React.DragEvent, targetId: string) => {
    setSaveStatus('saving')
    setErrorMessage('')

    try {
      await handleDrop(e, targetId)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      flashError(error instanceof Error ? error.message : 'Failed to save team member')
    }
  }

  // Editing carries the member as the drawer's payload
  const handleEdit = (member: TeamMemberRecord) => openDrawer(member)

  // Creating opens the drawer with just the role pre-selected
  const handleCreate = () => openDrawer({ role } as TeamMemberRecord)

  const handleDelete = async (memberId: string) => {
    setErrorMessage('')

    try {
      const result = await deleteTeamMember(memberId)

      if (!result.success) {
        flashError(result.error ?? 'Failed to delete team member')
        return
      }

      router.refresh()
    } catch (error) {
      flashError(error instanceof Error ? error.message : 'Failed to delete team member')
    }
  }

  return (
    <div className="space-y-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold dark:text-neutral-100 text-neutral-900">{roleLabel}</h1>
              <p className="mt-1 text-sm dark:text-neutral-400 text-neutral-600">
                Drag to reorder. Changes save automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreate}
              className="p-1.5 dark:hover:bg-neutral-800 hover:bg-neutral-100 rounded transition-colors shrink-0"
              title={`Add ${roleLabel.toLowerCase()}`}
              aria-label={`Add ${roleLabel.toLowerCase()}`}
            >
              <Plus className="w-4 h-4 dark:text-neutral-500 text-neutral-500" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {saveStatus === 'success' && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-lg dark:bg-sky-950/40 dark:border-sky-800/50 dark:text-sky-200 bg-sky-100/50 border-sky-300/50 text-sky-900 px-4 py-3 border"
          >
            <Check className="h-5 w-5 dark:text-sky-400 text-sky-600" aria-hidden="true" />
            <span className="text-sm">Saved successfully</span>
          </div>
        )}

        {saveStatus === 'error' && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-3 rounded-lg dark:bg-red-950/40 dark:border-red-800/50 dark:text-red-200 bg-red-100/50 border-red-300/50 text-red-900 px-4 py-3 border"
          >
            <AlertCircle className="h-5 w-5 dark:text-red-400 text-red-600" aria-hidden="true" />
            <span className="text-sm">{errorMessage || 'Failed to save'}</span>
          </div>
        )}

        {/* List Container */}
        <div className="space-y-2">
          {data.length === 0 ? (
            <div className="rounded-lg dark:bg-neutral-900 dark:text-neutral-400 bg-neutral-100 text-neutral-600 px-6 py-12 text-center">
              <p className="text-sm">No {roleLabel.toLowerCase()} added yet</p>
            </div>
          ) : (
            data.map((member, index) => (
              <div
                key={member.id}
                draggable
                onDragStart={(e) => handleDragStart(e, member.id)}
                onDragOver={(e) => handleDragOver(e, member.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropWithFeedback(e, member.id)}
                onDragEnd={handleDragEnd}
                className={`group relative flex items-center gap-4 rounded-lg border transition-all duration-200 ${
                  draggedOver === member.id
                    ? 'dark:border-sky-500/50 dark:bg-sky-950/20 border-sky-400/50 bg-sky-100/30'
                    : 'dark:border-neutral-800/50 dark:bg-neutral-900/50 dark:hover:border-neutral-700/50 border-neutral-300/50 bg-neutral-50 hover:border-neutral-400/50'
                } cursor-move px-4 py-4 md:px-6`}
              >
                {/* Drag Handle */}
                <div className="shrink-0 dark:text-neutral-600 dark:group-hover:text-sky-400 text-neutral-400 group-hover:text-sky-600 transition-colors">
                  <GripVertical className="h-5 w-5" aria-hidden="true" />
                </div>

                {/* Order Number */}
                <div className="shrink-0 w-8">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full dark:bg-neutral-800 dark:text-sky-200 bg-neutral-200 text-sky-700 text-xs font-medium">
                    {index + 1}
                  </span>
                </div>

                {/* Member Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium dark:text-neutral-100 text-neutral-900 truncate">{member.name}</h3>
                  {member.title && (
                    <p className="text-xs dark:text-neutral-500 text-neutral-600 truncate">{member.title}</p>
                  )}
                </div>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleEdit(member)}
                  className="shrink-0 p-2 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded-lg transition-colors"
                  title="Edit member"
                  aria-label={`Edit ${member.name}`}
                >
                  <Edit2 className="h-4 w-4" aria-hidden="true" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(member.id)}
                  className="shrink-0 p-2 dark:text-neutral-600 dark:hover:text-red-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-red-600 hover:bg-neutral-200 rounded-lg transition-colors"
                  title="Delete member"
                  aria-label={`Delete ${member.name}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>

                {/* Saving indicator */}
                {saveStatus === 'saving' && draggedOver === member.id && (
                  <div className="shrink-0">
                    <div className="inline-flex items-center justify-center h-4 w-4">
                      <div className="h-2 w-2 rounded-full dark:bg-sky-400 bg-sky-600 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        {data.length > 0 && (
          <div className="mt-8 text-xs dark:text-neutral-500 text-neutral-600">
            <p>
              Total: {data.length} {roleLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
