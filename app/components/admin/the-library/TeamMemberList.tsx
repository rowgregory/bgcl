'use client'

import { FC, useState, useTransition } from 'react'
import { GripVertical, Check, AlertCircle, Edit2 } from 'lucide-react'
import useTeamMemberList from '@/app/lib/hooks/useTeamMemberList'
import { store } from '@/app/lib/store/store'
import { setInputs } from '@/app/lib/store/slices/formSlice'
import { setOpenTeamMemberDrawer } from '@/app/lib/store/slices/teamMemberSlice'

interface TeamMemberListProps {
  data: any
  role: any
  roleLabel: string
}

export const TeamMemberList: FC<TeamMemberListProps> = ({ data, role, roleLabel }) => {
  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { draggedOver, dragPosition, handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } =
    useTeamMemberList(data, role)

  const handleDropWithFeedback = async (e: React.DragEvent, targetId: string) => {
    setSaveStatus('saving')
    setErrorMessage('')

    try {
      await handleDrop(e, targetId)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save order')
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleEditTeamMember = (member) => {
    store.dispatch(setInputs({ formName: 'teamMemberForm', data: { ...member, isUpdating: true } }))
    store.dispatch(setOpenTeamMemberDrawer())
  }

  return (
    <div className="space-y-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-100">{roleLabel}</h1>
          <p className="mt-1 text-sm text-neutral-400">Drag to reorder. Changes save automatically.</p>
        </div>

        {/* Status Messages */}
        {saveStatus === 'success' && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-sky-950/40 px-4 py-3 border border-sky-800/50">
            <Check className="h-5 w-5 text-sky-400" />
            <span className="text-sm text-sky-200">Saved successfully</span>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-950/40 px-4 py-3 border border-red-800/50">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-sm text-red-200">{errorMessage || 'Failed to save'}</span>
          </div>
        )}

        {/* List Container */}
        <div className="space-y-2">
          {data.length === 0 ? (
            <div className="rounded-lg bg-neutral-900 px-6 py-12 text-center">
              <p className="text-sm text-neutral-400">No {roleLabel.toLowerCase()} added yet</p>
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
                    ? dragPosition === 'top'
                      ? 'border-sky-500/50 bg-sky-950/20'
                      : 'border-sky-500/50 bg-sky-950/20'
                    : 'border-neutral-800/50 bg-neutral-900/50 hover:border-neutral-700/50'
                } ${isPending ? 'opacity-50' : ''} cursor-move px-4 py-4 md:px-6`}
              >
                {/* Drag Handle */}
                <div className="shrink-0 text-neutral-600 transition-colors group-hover:text-sky-400">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Order Number */}
                <div className="shrink-0 w-8">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-neutral-800 text-xs font-medium text-sky-200">
                    {index + 1}
                  </span>
                </div>

                {/* Member Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-neutral-100 truncate">{member.name}</h3>
                  <p className="text-xs text-neutral-500 truncate">{member.title}</p>
                </div>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleEditTeamMember(member)}
                  className="shrink-0 p-2 text-neutral-600 hover:text-sky-400 hover:bg-neutral-800 rounded-lg"
                  title="Edit member"
                >
                  <Edit2 className="h-4 w-4" />
                </button>

                {/* Status Indicator */}
                {saveStatus === 'saving' && draggedOver === member.id && (
                  <div className="shrink-0">
                    <div className="inline-flex items-center justify-center h-4 w-4">
                      <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        {data.length > 0 && (
          <div className="mt-8 text-xs text-neutral-500">
            <p>
              Total: {data.length} member{data.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
