'use server'

export async function getStripeCredentials() {
  return {
    accountId: 'acct_XXXXXXXXXX',
    email: 'dev.bgc.lynn@gmail.com',
    password: process.env.STRIPE_PASSWORD!,
    dashboardUrl: 'https://dashboard.stripe.com'
  }
}
