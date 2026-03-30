import { setInputs } from '../store/slices/formSlice'
import { store } from '../store/store'

export const setDonateCheckoutForm = (data: Record<string, any>) =>
  store.dispatch(setInputs({ formName: 'donateCheckoutForm', data }))
