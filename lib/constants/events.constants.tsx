import { EventTemplate } from '@/types/event.types'
import { EventType } from '@prisma/client'
import { Sparkles, Briefcase, Users, Music, GraduationCap, Heart, Trophy, Utensils, Wine } from 'lucide-react'

export const EVENT_CATEGORIES = [
  'Workshop',
  'Conference',
  'Networking',
  'Social',
  'Fundraiser',
  'Training',
  'Seminar',
  'Meetup',
  'Performance',
  'Other'
]

export const EVENT_TYPES = ['IN_PERSON', 'VIRTUAL', 'HYBRID']

export const DRESS_CODES = [
  'Casual',
  'Business Casual',
  'Business Professional',
  'Formal',
  'Black Tie',
  'Cocktail',
  'Smart Casual',
  'Athletic',
  'Themed'
]

export const DURATIONS = [
  '30 minutes',
  '1 hour',
  '1.5 hours',
  '2 hours',
  '3 hours',
  '4 hours',
  'Half Day',
  'Full Day',
  'Multi-Day'
]

export const REQUIREMENT_TAGS = [
  'ID Required',
  '21+ Only',
  '18+ Only',
  'Registration Required',
  'Pre-payment Required',
  'Vaccination Proof',
  'Background Check',
  'Photo Release',
  'Liability Waiver',
  'NDA Required'
]

export const MATERIAL_TAGS = [
  'Laptop',
  'Notebook',
  'Pen/Pencil',
  'Business Cards',
  'Portfolio',
  'Resume',
  'Calculator',
  'Textbook',
  'Art Supplies',
  'Athletic Wear',
  'Yoga Mat',
  'Water Bottle'
]

export const eventTemplates: EventTemplate[] = [
  {
    id: 'cash-madness',
    name: 'Cash Madness Raffle',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Casino-themed raffle fundraiser with sponsorship tiers',
    data: {
      title: 'Cash Madness Casino Night',
      description:
        "Join us for an exciting evening of casino games, live entertainment, and our signature $10,000 raffle drawing. All proceeds support the Boys & Girls Club of Lynn's Send a Kid to Camp program.",
      category: 'Fundraiser',
      type: EventType.IN_PERSON,
      dresscode: 'Themed',
      date: '2026-06-11T17:00',
      duration: '3 hours',
      location: 'Tedesco Country Club',
      maxAttendees: 250,
      requirements: '21+ Only',
      materials: 'Business Cards',
      isPublic: true,

      isRaffle: true,
      raffleDrawDate: '2026-06-11T22:30',
      raffleTerms:
        'Must be present at time of draw to claim prize. Show top half of ticket stub to enter. Only 500 tickets sold. Non-transferable. No cash value.',
      raffleTicketsPerOrder: 1,
      subtitle: 'Viva Las Vegas',
      tagline: 'Join Us For Our Send a Kid to Camp',
      address: '154 Tedesco St, Marblehead, MA 01945',
      website: 'www.bgcl.org',
      missionStatement:
        'To inspire and enable all young people, especially those who need us the most, to be responsible, caring and productive citizens of tomorrow.',
      registrationDeadline: '2026-05-22',
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
      ticketSalesStartDate: '2026-04-13T00:00',
      ticketSalesEndDate: '2026-06-11T22:30',
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
        'Best Dressed Prizes will be awarded during the event — so get creative and let your Vegas style shine!'
    }
  },
  {
    id: 'gala',
    name: 'Gala Event',
    icon: <Wine className="w-5 h-5" />,
    description: 'Formal seated dinner with awards, live auction, and sponsor recognition',
    data: {
      title: 'Annual Gala',
      description:
        'An evening of dinner, live entertainment, and celebration honoring the people who make our work possible. Proceeds support year-round programming at the Boys & Girls Club of Lynn.',
      category: 'Fundraiser',
      type: EventType.IN_PERSON,
      dresscode: 'Black Tie Optional',
      date: '2026-10-17T18:00',
      duration: '4 hours',
      location: 'Tedesco Country Club',
      maxAttendees: 200,
      requirements: '21+ Only',
      materials: 'Business Cards',
      isPublic: true,

      isRaffle: false,
      subtitle: 'An Evening of Impact',
      tagline: 'Celebrating Our Youth, Our Members, Our Future',
      address: '154 Tedesco St, Marblehead, MA 01945',
      website: 'www.bgcl.org',
      missionStatement:
        'To inspire and enable all young people, especially those who need us the most, to be responsible, caring and productive citizens of tomorrow.',
      registrationDeadline: '2026-10-03',
      ticketSalesStartDate: '2026-08-01T00:00',
      ticketSalesEndDate: '2026-10-17T18:00',

      raffleSchedule: [
        { time: '6:00 PM', label: 'Cocktail Reception & Silent Auction Opens' },
        { time: '7:00 PM', label: 'Dinner Service & Welcome' },
        { time: '7:45 PM', label: 'Youth of the Year Presentation' },
        { time: '8:15 PM', label: 'Live Auction & Fund a Need' },
        { time: '9:00 PM', label: 'Dancing & Dessert' },
        { time: 'All Night', label: 'Open Bar' }
      ],

      dressCodeHeadline: 'Black Tie Optional',
      dressCodeItems: [
        { label: 'Formal', description: 'Tuxedo, dark suit, floor-length or cocktail dress' },
        { label: 'Business Formal', description: 'Suit and tie, or a dressy separates combination' },
        { label: 'Festive Touches', description: 'A pop of color or a statement accessory is welcome' }
      ],
      dressCodeNote: 'Per Venue: No jeans, t-shirts, or hats allowed.',
      bestDressedPrizes: ''
    }
  },
  {
    id: 'conference',
    name: 'Business Conference',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'Professional business conference',
    data: {
      title: 'Industry Conference',
      description: 'A full-day conference featuring keynote speakers, panel discussions, and networking opportunities.',
      category: 'Conference',
      type: EventType.HYBRID,
      dresscode: 'Business Professional',
      date: '2026-06-11T22:30',
      duration: 'Full Day',
      location: 'Convention Center',
      maxAttendees: '500',
      requirements: 'Registration Required, Photo Release',
      materials: 'Laptop, Notebook, Business Cards',
      isPublic: true,

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
      raffleSchedule: null
    }
  },
  {
    id: 'networking',
    name: 'Networking Mixer',
    icon: <Users className="w-5 h-5" />,
    description: 'Casual networking event',
    data: {
      title: 'Professional Networking Mixer',
      description: 'Connect with local professionals over drinks and appetizers.',
      category: 'Networking',
      date: '2026-06-11T22:30',
      type: EventType.IN_PERSON,
      dresscode: 'Business Casual',
      duration: '2 hours',
      location: 'Local Restaurant & Bar',
      maxAttendees: '75',
      requirements: '18+ Only',
      materials: 'Business Cards',
      isPublic: true,

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
      raffleSchedule: null
    }
  },
  {
    id: 'concert',
    name: 'Live Concert',
    icon: <Music className="w-5 h-5" />,
    description: 'Evening concert performance',
    data: {
      title: 'Live Music Concert',
      description: 'An unforgettable evening of live music featuring talented performers.',
      category: 'Performance',
      type: EventType.IN_PERSON,
      dresscode: 'Casual',
      date: '2026-06-11T22:30',
      duration: '3 hours',
      location: 'Music Venue',
      maxAttendees: '300',
      requirements: 'ID Required',
      materials: '',
      isPublic: true,

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
      raffleSchedule: null
    }
  },
  {
    id: 'workshop',
    name: 'Training Workshop',
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'Educational workshop session',
    data: {
      title: 'Professional Development Workshop',
      description: 'Hands-on training session to develop new skills and knowledge.',
      category: 'Workshop',
      type: EventType.IN_PERSON,
      dresscode: 'Casual',
      date: '2026-06-11T22:30',
      duration: 'Half Day',
      location: 'Training Center',
      maxAttendees: '30',
      requirements: 'Registration Required, Pre-payment Required',
      materials: 'Laptop, Notebook, Pen/Pencil',
      isPublic: true,

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
      raffleSchedule: null
    }
  },
  {
    id: 'charity',
    name: 'Charity Fundraiser',
    icon: <Heart className="w-5 h-5" />,
    description: 'Charitable fundraising event',
    data: {
      title: 'Charity Fundraiser',
      description: 'Support a great cause while enjoying an evening of entertainment and community.',
      category: 'Fundraiser',
      date: '2026-06-11T22:30',
      type: EventType.IN_PERSON,
      dresscode: 'Smart Casual',
      duration: '3 hours',
      location: 'Community Hall',
      maxAttendees: '150',
      requirements: 'Registration Required',
      materials: '',
      isPublic: true,

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
      raffleSchedule: null
    }
  },
  {
    id: 'tournament',
    name: 'Sports Tournament',
    icon: <Trophy className="w-5 h-5" />,
    description: 'Competitive sports event',
    data: {
      title: 'Sports Tournament',
      description: 'Compete or spectate in this exciting tournament event.',
      category: 'Social',
      type: EventType.IN_PERSON,
      dresscode: 'Athletic',
      date: '2026-06-11T22:30',
      duration: 'Full Day',
      location: 'Sports Complex',
      maxAttendees: '100',
      requirements: 'Registration Required, Liability Waiver',
      materials: 'Athletic Wear, Water Bottle',
      isPublic: true,
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
      raffleSchedule: null
    }
  },
  {
    id: 'dinner',
    name: 'Dinner Event',
    icon: <Utensils className="w-5 h-5" />,
    description: 'Elegant dinner gathering',
    data: {
      title: 'Dinner Event',
      description: 'Join us for a memorable evening of fine dining and great company.',
      category: 'Social',
      type: EventType.IN_PERSON,
      dresscode: 'Business Casual',
      date: '2026-06-11T22:30',
      duration: '2 hours',
      location: 'Upscale Restaurant',
      maxAttendees: '50',
      requirements: 'Registration Required, 21+ Only',
      materials: '',
      isPublic: true,

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
      raffleSchedule: null
    }
  }
]
