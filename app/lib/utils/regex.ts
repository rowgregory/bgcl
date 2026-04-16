const phoneRegex = /^\+?1?\s?(\(?\d{3}\)?[\s.\-]?)(\d{3}[\s.\-]?\d{4})$/
const zipPostalCodeRegex = /^\d{5}(-\d{4})?$/

export const isValidPhoneNumber = (phone: string): boolean => {
  return phoneRegex.test(phone.trim())
}

export const isValidZipPostalCode = (zipPostalCode: string): boolean => {
  return zipPostalCodeRegex.test(zipPostalCode.trim())
}
