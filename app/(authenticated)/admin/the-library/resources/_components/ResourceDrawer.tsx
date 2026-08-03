'use client'

import { AnimatePresence } from 'framer-motion'
import Backdrop from '@/components/_shared/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '@/components/_shared/Drawer'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import {
  EMPTY_RESOURCE,
  ResourceFormInput,
  ResourceFormValues,
  resourceSchema
} from '@/lib/validations/resource.validation'
import { useResourceDrawer } from '@/stores/drawers'
import { FormProvider, useForm } from 'react-hook-form'
import { updateResource } from '@/lib/actions/resource/updateResource'
import { createResource } from '@/lib/actions/resource/createResource'
import ResourceForm from './ResourceForm'

export default function ResourceDrawer() {
  const isOpen = useResourceDrawer((s) => s.isOpen)
  const resource = useResourceDrawer((s) => s.data)
  const close = useResourceDrawer((s) => s.close)
  const router = useRouter()

  const isUpdating = Boolean(resource?.id)

  const methods = useForm<ResourceFormInput, unknown, ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: EMPTY_RESOURCE,
    mode: 'onTouched'
  })

  const { handleSubmit, reset, setError } = methods

  useEffect(() => {
    if (!isOpen) return

    if (!resource) {
      reset(EMPTY_RESOURCE)
      return
    }

    reset({
      title: resource.title,
      url: resource.url
    })
  }, [isOpen, resource, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = isUpdating ? await updateResource(resource.id, values) : await createResource(values)

      if (!res.success) {
        setError('root', { message: res.error })
        document.getElementById('resourceForm')?.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      close()
      router.refresh()
    } catch {
      setError('root', { message: `Failed to ${isUpdating ? 'update' : 'create'} resource. Please try again` })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />
          <Drawer>
            <FormProvider {...methods}>
              <form id="resourceForm" onSubmit={onSubmit} noValidate className="flex flex-col h-full min-h-0">
                <ResourceForm isUpdating={isUpdating} />
              </form>
            </FormProvider>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
