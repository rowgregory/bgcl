'use client'

import { setInputs } from '@/app/lib/store/slices/formSlice'
import { setOpenProgramDrawer } from '@/app/lib/store/slices/programSlice'
import { store } from '@/app/lib/store/store'
import { IProgram } from '@/types/entities/program'
import { Edit2, Trash2 } from 'lucide-react'

export const TheLibraryProgramsClient = ({ programs }) => {
  const handleEditProgram = (program: IProgram) => {
    store.dispatch(setInputs({ formName: 'programForm', data: { ...program, isUpdating: true } }))
    store.dispatch(setOpenProgramDrawer())
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-100">Programs</h1>
            <p className="mt-1 text-sm text-neutral-400">Manage youth programs and activities</p>
          </div>
        </div>

        {/* Programs List */}
        <div className="space-y-4">
          {programs.length === 0 ? (
            <div className="rounded-lg bg-neutral-900 px-6 py-12 text-center border border-neutral-800">
              <p className="text-sm text-neutral-400">No programs added yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-neutral-800 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900/50">
                    <th className="px-4 py-3 text-left font-medium text-neutral-300">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-300">Age Group</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-300">Frequency</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-300">Location</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-300">Drop-off</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-300">Pick-up</th>
                    <th className="px-4 py-3 text-right font-medium text-neutral-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {programs.map((program) => (
                    <tr key={program.id} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-neutral-100">{program.name}</p>
                          <p className="text-xs text-neutral-500 line-clamp-1">{program.description1}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-300">{program.ageGroup}</td>
                      <td className="px-4 py-3 text-neutral-300">{program.frequency}</td>
                      <td className="px-4 py-3 text-neutral-300 text-xs">{program.location}</td>
                      <td className="px-4 py-3 text-neutral-300 text-xs">
                        {program.dropOffStart} - {program.dropOffEnd}
                      </td>
                      <td className="px-4 py-3 text-neutral-300 text-xs">
                        {program.pickUpStart} - {program.pickUpEnd}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProgram(program)}
                            className="p-1.5 text-neutral-600 hover:text-sky-400 hover:bg-neutral-800 rounded transition-colors"
                            title="Edit program"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            // onClick={() => onDelete?.(program.id)}
                            className="p-1.5 text-neutral-600 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                            title="Delete program"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {programs.length > 0 && (
            <div className="text-xs text-neutral-500">
              <p>
                Total: {programs.length} program{programs.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
