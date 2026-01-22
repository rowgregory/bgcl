import { ICampaign } from '@/types/entities/campaign'

const validateCampaignForm = (
  inputs: Partial<ICampaign> | null,
  setErrors: (newErrors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.name || typeof inputs.name !== 'string' || !inputs.name.trim()) {
    newErrors.name = 'Please enter a valid name'
  }

  if (!inputs?.description || typeof inputs.description !== 'string' || !inputs.description.trim()) {
    newErrors.description = 'Please enter a valid description'
  }

  if (!inputs?.goalAmount || Number(inputs.goalAmount) === 0) {
    newErrors.goalAmount = 'Please enter an amount greater than 0'
  }
  if (inputs?.currentAmount == null || Number(inputs.currentAmount) < 0) {
    newErrors.currentAmount = 'Please enter an amount 0 or greater'
  }

  if (!inputs?.organizerName || typeof inputs.organizerName !== 'string' || !inputs.organizerName.trim()) {
    newErrors.organizerName = 'Please enter a valid organizer name'
  }

  if (!inputs?.startDate) {
    newErrors.startDate = 'Please enter a valid start date'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateCampaignForm
