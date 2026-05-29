export const initialEventFormState = {
  id: '',
  title: '',
  description: '',
  category: '',
  capacity: 200,
  attendeeCount: 0,
  type: 'IN_PERSON',
  dresscode: '',
  date: new Date(),
  time: '',
  duration: '',
  location: '',
  maxAttendees: null,
  status: 'UPCOMING',
  host: 'Boys & Girls Club of Lynn',
  requirements: '',
  materials: '',
  registrationUrl: '',
  meetingUrl: '',
  isPublic: false,
  registrationDeadline: new Date(),
  salesStartDate: null,
  salesEndDate: null,
  isUpdating: false,
  order: 0,

  // Raffle
  isRaffle: false,
  raffleDrawDate: null,
  raffleTerms: null,
  raffleTicketsPerOrder: 1,
  subtitle: null,
  tagline: null,
  address: null,
  website: null,
  missionStatement: null,
  raffleTicketPrice: null,
  raffleGrandPrizeLabel: null,
  raffleOddsLabel: null,
  rafflePrizes: null,
  raffleSchedule: null,

  // Add to initial state
  ticketSalesStartDate: null,
  ticketSalesEndDate: null,
  dressCodeHeadline: '',
  dressCodeNote: '',
  bestDressedPrizes: '',
  dressCodeItems: [],

  showTicketMarquee: false,
  showRaffleTicketNumbers: false
}

export const cashMadnessMockEvent = {
  id: '',
  title: 'Cash Madness Raffle',
  description:
    "Join us for an exciting evening of casino games, live entertainment, and our signature $10,000 raffle drawing. All proceeds support the Boys & Girls Club of Lynn's Send a Kid to Camp program.",
  category: 'Fundraiser',
  capacity: 500,
  attendeeCount: 0,
  type: 'IN_PERSON',
  dresscode: 'Themed',
  date: new Date('2026-06-11T17:00:00'),
  time: '17:00',
  duration: '3 hours',
  location: 'Tedesco Country Club',
  maxAttendees: 500,
  status: 'UPCOMING',
  featured: true,
  host: 'Boys & Girls Club of Lynn',
  requirements: '',
  materials: '',
  registrationUrl: 'https://www.bgcl.org',
  meetingUrl: '',
  isPublic: true,
  registrationDeadline: new Date('2026-06-10T23:59:00'),
  allowMultipleTickets: false,
  salesStartDate: new Date('2026-01-01T00:00:00'),
  salesEndDate: new Date('2026-06-11T17:00:00'),
  isUpdating: false,
  order: 0,

  // Raffle
  isRaffle: true,
  raffleDrawDate: new Date('2026-06-11T18:30:00'),
  raffleTerms:
    'Must be present at time of draw to claim prize. Show top half of ticket stub to enter. Only 500 tickets sold. Non-transferable. No cash value.',
  raffleTicketsPerOrder: 10,
  subtitle: 'Viva Las Vegas',
  tagline: 'Join Us For Our Send a Kid to Camp',
  address: '154 Tedesco St, Marblehead, MA 01945',
  website: 'www.bgcl.org',
  missionStatement:
    'To inspire and enable all young people, especially those who need us the most, to be responsible, caring and productive citizens of tomorrow.',
  raffleTicketPrice: '$100',
  raffleGrandPrizeLabel: '$10,000',
  raffleOddsLabel: '1:50 chance',
  rafflePrizes: [
    { place: 'Grand Prize', amount: '$10,000' },
    { place: '2nd Place', amount: '$1,750' },
    { place: '3rd Place', amount: '$1,500' },
    { place: '4th Place', amount: '$1,000' },
    { place: '5th Place', amount: '$750' },
    { place: '6th–10th Place', amount: '$500 ea.' }
  ],
  raffleSchedule: [
    { time: '5:00 PM', label: 'Doors Open' },
    { time: '5:15 PM – 6:15 PM', label: 'Casino Games' },
    { time: '6:30 PM – 7:00 PM', label: '$10K Raffle Drawing' },
    { time: '7:00 PM – 8:00 PM', label: 'Finale' },
    { time: 'All Night', label: 'Cash Bar & Buffet Provided' }
  ],
  dressCodeHeadline: 'Dress to Impress — or Just Have Fun!',
  dressCodeItems: [
    { label: 'High Roller Glam', description: 'Sparkle, metallics, or cocktail attire' },
    { label: 'Vegas Flair With Comfort', description: 'Sequin tees, shiny jackets, or fun shoes' },
    {
      label: 'Casino Characters',
      description: 'Dealer vests, bow ties, showgirl-inspired accessories, or playful mobster looks'
    },
    { label: 'Neon & Glitter Fun', description: 'Bright colors, glow bracelets, or light-up accessories' }
  ],
  dressCodeNote: 'Per Venue: No jeans, t-shirts, or hats allowed.',
  bestDressedPrizes:
    'Best Dressed Prizes will be awarded during the event — so get creative and let your Vegas style shine!',
  ticketSalesStartDate: '2026-05-13T04:00:00.000Z', // midnight EST (UTC-4)
  ticketSalesEndDate: '2026-06-11T22:30:00.000Z' // 6:30 PM EST (UTC-4)
}
