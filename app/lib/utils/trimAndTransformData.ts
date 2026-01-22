export function trimAndTransformData<T extends Record<string, any>>(
  obj: T,
  options: {
    dateFields?: string[]
    numberFields?: string[]
    nullableFields?: string[]
    ignoreFields?: string[]
  } = {}
): T {
  const transformed = { ...obj }

  // Remove ignored fields
  if (options.ignoreFields) {
    for (const field of options.ignoreFields) {
      delete transformed[field]
    }
  }

  for (const key in transformed) {
    const value = transformed[key]

    // Handle null/undefined
    if (value === null || value === undefined || value === '') {
      if (options.nullableFields?.includes(key)) {
        transformed[key] = null as any
      }
      continue
    }

    // Trim strings
    if (typeof value === 'string') {
      transformed[key] = value.trim() as any
    }

    // Convert dates (after trimming if it was a string)
    if (options.dateFields?.includes(key) && transformed[key]) {
      transformed[key] = new Date(transformed[key]) as any
    }

    // Convert numbers
    if (options.numberFields?.includes(key)) {
      transformed[key] = Number(transformed[key]) as any
    }
  }

  return transformed
}
