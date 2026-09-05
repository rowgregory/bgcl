const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export const formatCurrency = (amount: number) => usdFormatter.format(Number(amount ?? 0))

export const formatCents = (cents: number) => usdFormatter.format(Number(cents ?? 0) / 100)

export const formatCurrencyWhole = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(amount ?? 0))
