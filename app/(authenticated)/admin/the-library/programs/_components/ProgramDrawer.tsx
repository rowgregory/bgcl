'use client'

import { AnimatePresence } from 'framer-motion'
import Backdrop from '@/components/_shared/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '@/components/_shared/Drawer'
import { useProgramDrawer } from '@/stores/drawers'
import { FormProvider, useForm } from 'react-hook-form'
import { EMPTY_PROGRAM, ProgramFormInput, ProgramFormValues, programSchema } from '@/lib/validations/program.validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { updateProgram } from '@/lib/actions/program/updateProgram'
import { createProgram } from '@/lib/actions/program/createProgram'
import ProgramForm from './ProgramForm'
import { Theme } from '@prisma/client'

export default function ProgramDrawer({ themes }: { themes: Theme[] }) {
  const isOpen = useProgramDrawer((s) => s.isOpen)
  const program = useProgramDrawer((s) => s.data)
  const close = useProgramDrawer((s) => s.close)
  const router = useRouter()

  const isUpdating = Boolean(program?.id)

  const methods = useForm<ProgramFormInput, unknown, ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: EMPTY_PROGRAM,
    mode: 'onTouched'
  })

  const { handleSubmit, reset, setError } = methods

  useEffect(() => {
    if (!isOpen) return

    if (!program) {
      reset(EMPTY_PROGRAM)
      return
    }

    reset({
      name: program.name,
      descriptions: program.descriptions ?? [],
      image: program.image ?? '',
      imageTwo: program.imageTwo ?? '',
      ageGroup: program.ageGroup ?? '',
      showAgeGroup: program.showAgeGroup,
      location: program.location ?? '',
      frequency: program.frequency ?? '',
      dropOffStart: program.dropOffStart ?? '',
      dropOffEnd: program.dropOffEnd ?? '',
      pickUpStart: program.pickUpStart ?? '',
      pickUpEnd: program.pickUpEnd ?? '',
      datesAvailable: program.datesAvailable ?? '',
      license: program.license ?? '',
      additionalDetails: program.additionalDetails ?? [],
      showThemes: program.showThemes,
      themes: program.themes ?? [],
      externalLink: program.externalLink ?? '',
      pdfLink: program.pdfLink ?? '',
      pdfDescription: program.pdfDescription ?? '',
      isListed: program.isListed
    })
  }, [isOpen, program, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = isUpdating ? await updateProgram(program.id, values) : await createProgram(values)

      if (!res.success) {
        setError('root', { message: res.error })
        document.getElementById('programForm')?.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      close()
      router.refresh()
    } catch {
      setError('root', { message: `Failed to ${isUpdating ? 'update' : 'create'} program. Please try again` })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />
          <Drawer>
            <FormProvider {...methods}>
              <form id="programForm" onSubmit={onSubmit} noValidate className="flex flex-col h-full min-h-0">
                <ProgramForm isUpdating={isUpdating} themes={themes} />
              </form>
            </FormProvider>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
