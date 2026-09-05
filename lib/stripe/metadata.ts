const MAX_METADATA_LENGTH = 450

export const trim = (value?: string | null) => (value ?? '').slice(0, MAX_METADATA_LENGTH)
