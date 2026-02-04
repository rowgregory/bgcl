export default async function getGoogleAnalyticsCredentials() {
  return {
    analyticsId: 'G-XXXXXXXXXX',
    email: 'dev.bgc.lynn@gmail.com',
    password: process.env.GOOGLE_ANALYRICS_PASSWORD,
    gcpUrl:
      'https://analytics.google.com/analytics/web/#/a337968536p518966189/reports/intelligenthome?params=_u..nav%3Dmaui'
  }
}
