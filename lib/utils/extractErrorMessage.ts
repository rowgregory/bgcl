export function extractErrorMessage(error: unknown): string {
  try {
    if (
      error &&
      typeof error === 'object' &&
      'data' in error &&
      error.data &&
      typeof error.data === 'object' &&
      'message' in error.data
    ) {
      return String(error.data.message)
    }

    if (error && typeof error === 'object' && 'error' in error && typeof error.error === 'string') {
      return error.error
    }

    if (error instanceof Error && error.message) {
      return error.message
    }

    if (typeof error === 'string' && error) {
      return error
    }
  } catch {
    // fall through to default message
  }

  return 'Unable to process request.'
}

export default extractErrorMessage
