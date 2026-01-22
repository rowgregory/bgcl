'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { revalidateTag } from 'next/cache'

export async function deleteTheme(themeId: string) {
  try {
    // Get all programs and filter in JavaScript
    const allPrograms = await prisma.program.findMany()

    const programsWithTheme = allPrograms.filter((program) => {
      const themes = program.themes as any
      return Array.isArray(themes) && themes.some((theme: any) => theme.id === themeId)
    })

    // Remove the theme from each program's themes array
    for (const program of programsWithTheme) {
      const currentThemes = program.themes as any[]
      const updatedThemes = currentThemes.filter((theme: any) => theme.id !== themeId)

      await prisma.program.update({
        where: { id: program.id },
        data: { themes: updatedThemes }
      })
    }

    // Delete the theme
    await prisma.theme.delete({
      where: { id: themeId }
    })

    await createLog('info', 'Theme deleted successfully', {
      themeId,
      programsUpdated: programsWithTheme.length
    })

    revalidateTag('Theme', 'default')
    revalidateTag('Program', 'default')

    return { success: true, programsUpdated: programsWithTheme.length }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete theme'

    await createLog('error', 'Failed to delete theme', {
      error: errorMessage,
      themeId
    })

    throw new Error(errorMessage)
  }
}
