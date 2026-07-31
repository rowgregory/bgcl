import { setInputs } from '../store/slices/formSlice'
import { store } from '../store/store'

export const setTicketCheckoutForm = (data: Record<string, any>) =>
  store.dispatch(setInputs({ formName: 'ticketCheckoutForm', data }))
