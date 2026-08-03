export type SubscriptionClientProps = {
  data: {
    subscription: {
      id: string
      status: string
      cancel_at_period_end: boolean
      canceled_at: string | null
      current_period_start: string | null
      current_period_end: string | null
      created: string | null
      billing_cycle_anchor: string | null
      days_until_due: number | null
      collection_method: string
      cancellation_details: {
        comment: string | null
        feedback: string | null
        reason: string | null
      } | null
      items: Array<{
        id: string
        price: {
          id: string
          unit_amount: number
          currency: string
          recurring: {
            interval: string
            interval_count: number
          }
        }
        quantity: number
      }>
      default_payment_method: {
        id: string
        type: string
        card: {
          brand: string
          last4: string
          exp_month: number
          exp_year: number
        } | null
      } | null
      latest_invoice: {
        id: string
        amount_due: number
        amount_paid: number
        status: string
        created: string
        hosted_invoice_url: string | null
        invoice_pdf: string | null
      } | null
      trial_start: string | null
      trial_end: string | null
      metadata: Record<string, string>
    }
    order: {
      id: string
      type: string
      status: string
      totalAmount: number
      customerName: string
      customerEmail: string
      customerPhone: string | null
      recurringFrequency: string
      paymentMethod: string
      isRecurring: boolean
      stripeSubscriptionId: string | null
      paymentIntentId: string | null
      nextBillingDate: string | null
      paidAt: string | null
      createdAt: string
      updatedAt: string
    } | null
    isCancelled: boolean
    willCancelAtPeriodEnd: boolean
    currentPeriodEnd: string | null
    isActive: boolean
    isPastDue: boolean
    isUnpaid: boolean
  }
}

export interface CancelSubscriptionDetails {
  subscriptionId: string
  subscriptionAmount: number
  nextBillingDate: string
}
