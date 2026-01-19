import { INews } from '@/types/entities/news'

const validateNewsForm = (inputs: Partial<INews> | null, setErrors: (newErrors: Record<string, string>) => void) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.title || typeof inputs.title !== 'string' || !inputs.title.trim()) {
    newErrors.title = 'Please enter a valid news title'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateNewsForm
