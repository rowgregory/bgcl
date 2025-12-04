import { Ticket } from '@prisma/client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// export type Inputs = Record<string, string | number | boolean | Date>;

export type Inputs = {
  [key: string]: string | number | boolean | Date | Ticket[] | null
}

export type Errors = {
  [key: string]: string
}

interface SetErrorsProps {
  formName: string
  errors: Errors
}

interface HandleInputProps {
  formName: string
  name: string
  value: string | number | boolean
}

interface HandleSelectProps {
  formName: string
  name: string
  value: string
}

interface HandleToggleProps {
  formName: string
  name: string
  checked: boolean
}

interface FormData {
  inputs: Inputs
  errors: Errors
}

interface InitialFormState {
  progress: number
  isEditing: boolean
  forms: { [formName: string]: FormData }
}

const formInitialState: InitialFormState = {
  progress: 0,
  isEditing: false,
  forms: {
    eventForm: { inputs: {}, errors: {} },
    eventTicketForm: { inputs: {}, errors: {} }
  }
}

const formSlice = createSlice({
  name: 'form',
  initialState: formInitialState,
  reducers: {
    setIsEditing: (state) => {
      state.isEditing = true
    },
    setIsNotEditing: (state) => {
      state.isEditing = false
    },
    resetForm: (state, { payload }: PayloadAction<string>) => {
      const form = state.forms[payload]
      if (form && typeof form === 'object' && 'inputs' in form) {
        form.inputs = {}
        form.errors = {}
      }
    },
    setInputs: (state, { payload }) => {
      const { formName, data } = payload
      if (!state.forms[formName]) {
        state.forms[formName] = { inputs: {}, errors: {} }
      }
      state.forms[formName].inputs = {
        ...state.forms[formName].inputs,
        ...data
      }
    },
    setErrors: (state, { payload }: PayloadAction<SetErrorsProps>) => {
      const { formName, errors } = payload
      if (!state.forms[formName]) {
        state.forms[formName] = { inputs: {}, errors: {} }
      }
      state.forms[formName].errors = errors
    },
    clearInputs: (state, { payload }: PayloadAction<{ formName: string }>) => {
      const { formName } = payload
      const form = state.forms[formName]
      if (form && typeof form === 'object' && 'inputs' in form) {
        form.inputs = {}
      }
    },
    clearErrors: (state, { payload }: PayloadAction<{ formName: string }>) => {
      const { formName } = payload
      const form = state.forms[formName]
      if (form && typeof form === 'object' && 'errors' in form) {
        form.errors = {}
      }
    },
    handleInput: (state, action: PayloadAction<HandleInputProps>) => {
      const { formName, name, value } = action.payload
      const form = state.forms[formName]

      if (!form || typeof form !== 'object' || !('inputs' in form)) return
      ;(state.forms[formName] as FormData) = {
        ...form,
        inputs: {
          ...form.inputs,
          [name]: value
        },
        errors: {
          ...form.errors
        }
      }
    },
    handleSelect: (state, { payload }: PayloadAction<HandleSelectProps>) => {
      const { formName, name, value } = payload
      const form = state.forms[formName]
      if (form && typeof form === 'object' && 'inputs' in form) {
        form.inputs[name] = value
      }
    },
    handleToggle: (state, { payload }: PayloadAction<HandleToggleProps>) => {
      const { formName, name, checked } = payload
      const form = state.forms[formName]

      if (!form || typeof form !== 'object' || !('inputs' in form)) return
      ;(state.forms[formName] as FormData) = {
        ...form,
        inputs: {
          ...form.inputs,
          [name]: checked
        },
        errors: {
          ...form.errors
        }
      }
    },
    setUploadProgress: (state, { payload }: PayloadAction<number>) => {
      state.progress = payload
    }
  }
})

type AppDispatch = (action: { type: string; payload?: unknown }) => void

export const createFormActions = (formName: string, dispatch: AppDispatch) => ({
  setInputs: (data: Inputs) => dispatch(formSlice.actions.setInputs({ formName, data })),
  clearInputs: () => dispatch(formSlice.actions.clearInputs({ formName })),
  setErrors: (errors: Errors) => dispatch(formSlice.actions.setErrors({ formName, errors })),
  handleInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    dispatch(
      formSlice.actions.handleInput({
        formName,
        name: e.target.name,
        value: e.target.value
      })
    ),
  handleSelect: (e: React.ChangeEvent<HTMLSelectElement>) =>
    dispatch(
      formSlice.actions.handleSelect({
        formName,
        name: e.target.name,
        value: e.target.value
      })
    ),
  handleToggle: (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(
      formSlice.actions.handleToggle({
        formName,
        name: e.target.name,
        checked: e.target.checked
      })
    ),
  handleUploadProgress: (progress: number) => dispatch(formSlice.actions.setUploadProgress(progress))
})

export const { resetForm, setInputs, clearInputs, clearErrors, setIsEditing, setIsNotEditing } = formSlice.actions
export const formReducer = formSlice.reducer
