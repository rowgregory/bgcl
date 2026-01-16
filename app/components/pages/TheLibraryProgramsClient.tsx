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
    <div className="min-h-screen dark:bg-neutral-950 dark:p-6 dark:md:p-8 bg-white p-6 md:p-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold dark:text-neutral-100 text-neutral-900">Programs</h1>
            <p className="mt-1 text-sm dark:text-neutral-400 text-neutral-600">Manage youth programs and activities</p>
          </div>
        </div>

        {/* Programs List */}
        <div className="space-y-4">
          {programs.length === 0 ? (
            <div className="rounded-lg dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 px-6 py-12 text-center border">
              <p className="text-sm dark:text-neutral-400 text-neutral-600">No programs added yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto dark:border-neutral-800 border-neutral-200 border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="dark:border-neutral-800 dark:bg-neutral-900/50 border-neutral-200 bg-neutral-100 border-b">
                    <th className="px-4 py-3 text-left font-medium dark:text-neutral-300 text-neutral-700">Name</th>
                    <th className="px-4 py-3 text-left font-medium dark:text-neutral-300 text-neutral-700">
                      Age Group
                    </th>
                    <th className="px-4 py-3 text-left font-medium dark:text-neutral-300 text-neutral-700">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left font-medium dark:text-neutral-300 text-neutral-700">Location</th>
                    <th className="px-4 py-3 text-left font-medium dark:text-neutral-300 text-neutral-700">Drop-off</th>
                    <th className="px-4 py-3 text-left font-medium dark:text-neutral-300 text-neutral-700">Pick-up</th>
                    <th className="px-4 py-3 text-right font-medium dark:text-neutral-300 text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="dark:divide-neutral-800 divide-neutral-200 divide-y">
                  {programs.map((program) => (
                    <tr key={program.id} className="dark:hover:bg-neutral-900/50 hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium dark:text-neutral-100 text-neutral-900">{program.name}</p>
                          <p className="text-xs dark:text-neutral-500 text-neutral-500 line-clamp-1">
                            {program.description1}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 dark:text-neutral-300 text-neutral-700">{program.ageGroup}</td>
                      <td className="px-4 py-3 dark:text-neutral-300 text-neutral-700">{program.frequency}</td>
                      <td className="px-4 py-3 text-xs dark:text-neutral-300 text-neutral-700">{program.location}</td>
                      <td className="px-4 py-3 text-xs dark:text-neutral-300 text-neutral-700">
                        {program.dropOffStart} - {program.dropOffEnd}
                      </td>
                      <td className="px-4 py-3 text-xs dark:text-neutral-300 text-neutral-700">
                        {program.pickUpStart} - {program.pickUpEnd}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProgram(program)}
                            className="p-1.5 dark:text-neutral-600 dark:hover:text-sky-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-sky-600 hover:bg-neutral-200 rounded transition-colors"
                            title="Edit program"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            // onClick={() => onDelete?.(program.id)}
                            className="p-1.5 dark:text-neutral-600 dark:hover:text-red-400 dark:hover:bg-neutral-800 text-neutral-600 hover:text-red-600 hover:bg-neutral-200 rounded transition-colors"
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
            <div className="text-xs dark:text-neutral-500 text-neutral-600">
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
