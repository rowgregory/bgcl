// Additional JSON-LD structured data for SEO
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Boys & Girls Club of Lynn',
  alternateName: 'BGCL',
  url: 'https://bgcl.org',
  logo: 'https://firebasestorage.googleapis.com/v0/b/boys-and-girls-club-of-l-a2ad0.firebasestorage.app/o/images%2Fbgcl-rich-preview.png?alt=media&token=9f84b230-3ad2-4745-9c25-e84b63cab7cb',
  description: 'The Boys & Girls Club of Lynn provides safe, enriching programs for youth in Lynn, Massachusetts.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '25 N Common St',
    addressLocality: 'Lynn',
    addressRegion: 'MA',
    postalCode: '01902',
    addressCountry: 'US'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '42.4668',
    longitude: '-70.9495'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-781-593-1772',
    contactType: 'Customer Service',
    areaServed: 'US',
    availableLanguage: ['English', 'Spanish']
  },
  sameAs: [
    'https://www.facebook.com/LynnBoysAndGirlsClub',
    'https://www.instagram.com/bgclynn/',
    'https://twitter.com/LynnBoysAndGirlsClub',
    'www.youtube.com/@bgclynn6169'
  ],
  areaServed: {
    '@type': 'City',
    name: 'Lynn',
    '@id': 'https://en.wikipedia.org/wiki/Lynn,_Massachusetts'
  },
  memberOf: {
    '@type': 'Organization',
    name: 'Boys & Girls Clubs of America',
    url: 'https://www.bgca.org'
  },
  nonprofitStatus: 'Nonprofit501c3'
}
