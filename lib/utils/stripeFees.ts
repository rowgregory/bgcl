export const STRIPE_PERCENT = 0.029
export const STRIPE_FIXED_CENTS = 30

export const grossUpCents = (subtotalCents: number) =>
  Math.round((subtotalCents + STRIPE_FIXED_CENTS) / (1 - STRIPE_PERCENT)) - subtotalCents

export const calculateStripeFees = (dollars: number) => grossUpCents(Math.round(dollars * 100)) / 100
