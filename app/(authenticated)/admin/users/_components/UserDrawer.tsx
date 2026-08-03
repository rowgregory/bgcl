'use client'

import { AnimatePresence } from 'framer-motion'
import Backdrop from '@/components/_shared/Backdrop'
import { useRouter } from 'next/navigation'
import Drawer from '@/components/_shared/Drawer'
import { useUserDrawer } from '@/stores/drawers'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { EMPTY_USER, UserFormInput, UserFormValues, userSchema } from '@/lib/validations/user.validation'
import UserForm from './UserForm'
import { updateUser } from '@/lib/actions/user/updateUser'
import { createUser } from '@/lib/actions/user/createUser'

export default function UserDrawer() {
  const isOpen = useUserDrawer((s) => s.isOpen)
  const user = useUserDrawer((s) => s.data)
  const close = useUserDrawer((s) => s.close)
  const router = useRouter()

  const isUpdating = Boolean(user?.id)

  const methods = useForm<UserFormInput, unknown, UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: EMPTY_USER,
    mode: 'onTouched'
  })

  const { handleSubmit, reset, setError } = methods

  useEffect(() => {
    if (!isOpen) return

    if (!user) {
      reset(EMPTY_USER)
      return
    }

    reset({
      email: user.email,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      role: user.role,
      phone: user.phone ?? '',
      position: user.position ?? '',
      department: user.department ?? ''
    })
  }, [isOpen, user, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = isUpdating ? await updateUser(user.id, values) : await createUser(values)

      if (!res.success) {
        setError('root', { message: res.error })
        document.getElementById('userForm')?.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      close()
      router.refresh()
    } catch {
      setError('root', { message: `Failed to ${isUpdating ? 'update' : 'create'} user. Please try again` })
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={close} />
          <Drawer>
            <FormProvider {...methods}>
              <form id="userForm" onSubmit={onSubmit} noValidate className="flex flex-col h-full min-h-0">
                <UserForm isUpdating={isUpdating} />
              </form>
            </FormProvider>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
