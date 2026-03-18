'use client'

import { AnimatePresence } from 'framer-motion'
import { setCloseUserDrawer } from '@/app/lib/store/slices/userSlice'
import { createFormActions, resetForm, setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store, useFormSelector, useUserSelector } from '@/app/lib/store/store'
import Backdrop from '../common/Backdrop'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import UserForm from '../forms/UserForm'
import validateUserForm from '@/app/lib/validations/user'
import { updateUser } from '@/app/lib/actions/updateUser'
import Drawer from '../common/Drawer'
import { useRouter } from 'next/navigation'
import { CreateUserInputs, UpdateUserInputs } from '@/types/entities/user'
import { createUser } from '@/app/lib/actions/createUser'

export const UserDrawer = () => {
  const { userDrawer } = useUserSelector()
  const { forms, isLoading } = useFormSelector()
  const inputs = forms.userForm.inputs
  const errors = forms.userForm.errors
  const { handleInput, setErrors, handleToggle } = createFormActions('userForm', store.dispatch)
  const router = useRouter()

  const onClose = () => {
    store.dispatch(resetForm('userForm'))
    store.dispatch(setCloseUserDrawer())
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateUserForm(inputs, setErrors)) return

    try {
      store.dispatch(setIsLoading(true))

      if (inputs?.isUpdating) {
        await updateUser(inputs as UpdateUserInputs)
      } else {
        await createUser(inputs as CreateUserInputs)
      }

      router.refresh()
      onClose()
      store.dispatch(
        showToast({
          type: 'success',
          message: `${inputs?.isUpdating ? 'User Updated!' : 'User Created!'}`,
          description: inputs?.isUpdating
            ? 'Your user has been successfully updated.'
            : 'Your user has been successfully created!'
        })
      )
    } catch (error) {
      const errorMessage = extractErrorMessage(error)

      store.dispatch(
        showToast({
          type: 'error',
          message: `${inputs?.isUpdating ? 'Update' : 'Create'} User Failed`,
          description: errorMessage
        })
      )
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {userDrawer && (
        <>
          {/* Backdrop Overlay */}
          <Backdrop onClose={onClose} />

          {/* Drawer */}
          <Drawer>
            {/* Form */}
            <UserForm
              errors={errors}
              handleInput={handleInput}
              handleSubmit={handleSubmit}
              handleToggle={handleToggle}
              inputs={inputs}
              isLoading={isLoading}
              isUpdating={inputs?.isUpdating}
              onClose={onClose}
            />
          </Drawer>
        </>
      )}
    </AnimatePresence>
  )
}
