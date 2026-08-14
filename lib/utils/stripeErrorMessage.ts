import extractErrorMessage from '@/lib/utils/extractErrorMessage'

type StripeErrorShape = {
  code?: string
  decline_code?: string
}

const DECLINE_MESSAGES: Record<string, string> = {
  insufficient_funds: 'This card has insufficient funds. Try a different card.',
  lost_card: 'This card was declined. Contact your bank for more information.',
  stolen_card: 'This card was declined. Contact your bank for more information.',
  expired_card: 'This card has expired. Try a different card.',
  incorrect_cvc: 'The security code (CVC) is incorrect. Check it and try again.',
  incorrect_number: 'This card number is incorrect. Check it and try again.',
  card_velocity_exceeded: 'Too many attempts on this card. Try again later or use a different card.',
  do_not_honor: 'This card was declined. Contact your bank for more information.',
  do_not_try_again: 'This card was declined. Contact your bank for more information.',
  fraudulent: 'This card was declined. Contact your bank for more information.',
  generic_decline: 'This card was declined. Try a different card or contact your bank.'
}

const CODE_MESSAGES: Record<string, string> = {
  card_declined: 'This card was declined. Try a different card.',
  expired_card: 'This card has expired. Try a different card.',
  incorrect_cvc: 'The security code (CVC) is incorrect.',
  incorrect_zip: 'The ZIP code does not match this card. Check it and try again.',
  invalid_expiry_month: 'The expiry date on this card is invalid.',
  invalid_expiry_year: 'The expiry date on this card is invalid.',
  invalid_number: 'This card number is invalid.',
  processing_error: 'A processing error occurred. Try again in a moment.'
}

/**
 * Maps a Stripe error to a message a person can act on.
 * Falls back to `extractErrorMessage` for anything unrecognized.
 */
export default function stripeErrorMessage(error: unknown): string {
  const { code, decline_code: declineCode } = (error ?? {}) as StripeErrorShape

  if (declineCode && DECLINE_MESSAGES[declineCode]) return DECLINE_MESSAGES[declineCode]
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code]

  return extractErrorMessage(error)
}
