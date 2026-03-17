export const calculateStripeFees = (donationAmount: number) => {
  const amount = parseFloat(donationAmount.toString()) || 0
  // Formula: (amount + 0.30) / (1 - 0.022) - amount
  // This ensures after Stripe takes fees, you get the original amount
  const totalNeeded = (amount + 0.3) / (1 - 0.022)
  return totalNeeded - amount
}
