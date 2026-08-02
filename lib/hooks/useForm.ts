import { useState, useCallback } from 'react'

export function useForm<T extends Record<string, any>>(initial: T) {
  const [inputs, setInputs] = useState<T>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      const next = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      setInputs((s) => ({ ...s, [name]: next }))
      setErrors((s) => {
        if (!s[name as keyof T]) return s
        const c = { ...s }
        delete c[name as keyof T]
        return c
      })
    },
    []
  )

  const setField = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setInputs((s) => ({ ...s, [name]: value }))
  }, [])

  const reset = useCallback(() => {
    setInputs(initial)
    setErrors({})
  }, [initial])

  return { inputs, errors, setInputs, setErrors, handleInput, setField, reset }
}
