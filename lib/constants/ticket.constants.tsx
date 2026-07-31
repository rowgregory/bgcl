import { TicketTemplate } from '@/types/entities/ticket'
import { Users, Crown, Zap, Ticket, TrendingUp, Radio, Spade } from 'lucide-react'
export const ticketTemplates: TicketTemplate[] = [
  // ── Cash Madness 2026 ──────────────────────────────────────────────────────

  {
    id: 'cash-madness-raffle',
    name: 'Cash Madness Raffle Ticket',
    icon: <Ticket className="w-5 h-5" />,
    description: 'General admission + one raffle entry. 21+ event. Proper dress required.',
    data: {
      name: 'Cash Madness Raffle Ticket',
      description:
        'Admits one guest. Includes one raffle entry for a chance to win up to $10,000. Must be present at time of draw to claim prize.',
      price: 100,
      totalQuantity: 500,
      isPublished: true,
      sortOrder: 0,
      ticketType: 'RAFFLE',
      isRaffleTicket: true,
      guestCount: 1
    }
  },
  {
    id: 'cash-madness-blackjack',
    name: 'Blackjack Tournament',
    icon: <Spade className="w-5 h-5" />,
    description: 'Reserve your spot in the blackjack tournament. Limited to 50 participants.',
    data: {
      name: 'Blackjack Tournament Entry',
      description: 'Reserves your spot in the Cash Madness blackjack tournament. Limited to 50 participants.',
      price: 50,
      totalQuantity: 50,
      isPublished: true,
      sortOrder: 1,
      ticketType: 'TOURNAMENT',
      isRaffleTicket: false,
      guestCount: 1
    }
  },
  {
    id: 'cash-madness-hi-roller',
    name: 'Hi-Roller Sponsor — $3,000',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Top-tier sponsorship. Covers 10 campers for the week.',
    data: {
      name: 'Hi-Roller Sponsor',
      description: 'Top-tier event sponsorship for the Cash Madness Raffle.',
      price: 3000,
      totalQuantity: 6,
      isPublished: true,
      sortOrder: 2,
      ticketType: 'SPONSORSHIP',
      isRaffleTicket: false,
      sponsorImpact:
        'Covers 10 campers for the week to enjoy boating, fishing, swimming, basketball, arts & crafts, and making lifelong friends.',
      sponsorPerks: [
        'Constant recognition throughout the event',
        'Company logo on play money',
        'Social media recognition prior to the event',
        'Prime Sponsor Board placement in a high-traffic location',
        'Admission for up to 10 guests',
        'A representative helps pull the final 10 winners, including the $10k grand prize'
      ],
      guestCount: 10
    }
  },
  {
    id: 'cash-madness-all-in',
    name: 'All-In Sponsor — $1,500',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Provides 4 campers a full week of camp activities.',
    data: {
      name: 'All-In Sponsor',
      description: 'Second-tier event sponsorship for the Cash Madness Raffle.',
      price: 1500,
      totalQuantity: 8,
      isPublished: true,
      sortOrder: 3,
      ticketType: 'SPONSORSHIP',
      isRaffleTicket: false,
      sponsorImpact: 'Provides 4 campers a full week of camp to enjoy all camp activities and forming friendships.',
      sponsorPerks: [
        'Recognition during the dinner or main event portion',
        'Signage displayed around the dinner and bar area',
        'Social media recognition prior to the event',
        'Admission for up to 5 guests'
      ],
      guestCount: 5
    }
  },
  {
    id: 'cash-madness-lucky-7',
    name: 'Lucky 7-Eleven Sponsor — $500',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Supports 2 campers for a full week of camp.',
    data: {
      name: 'Lucky 7-Eleven Sponsor',
      description: 'Third-tier event sponsorship for the Cash Madness Raffle.',
      price: 500,
      totalQuantity: 10,
      isPublished: true,
      sortOrder: 4,
      ticketType: 'SPONSORSHIP',
      isRaffleTicket: false,
      sponsorImpact:
        'Supports 2 full weeks of camp — letting 2 campers experience swimming, basketball, arts & crafts, and rec hall activities.',
      sponsorPerks: [
        'Recognition during the casino game portion of the event',
        'Signage displayed around casino gaming area',
        'Admission for up to 3 guests'
      ],
      guestCount: 3
    }
  },
  {
    id: 'cash-madness-ace-of-hearts',
    name: 'Ace of Hearts Sponsor — $250',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Helps support 1 camper for a full week of camp.',
    data: {
      name: 'Ace of Hearts Sponsor',
      description: 'Entry-level event sponsorship for the Cash Madness Raffle.',
      price: 250,
      totalQuantity: 10,
      isPublished: true,
      sortOrder: 5,
      ticketType: 'SPONSORSHIP',
      isRaffleTicket: false,
      sponsorImpact: 'Helps support 1 camper to enjoy a full week of swimming, basketball, fishing, and more.',
      sponsorPerks: ['Social media recognition', 'Vocal recognition at event', 'Signage around cocktail area'],
      guestCount: 1
    }
  },

  // ── Generic Templates ──────────────────────────────────────────────────────

  {
    id: 'general-admission',
    name: 'General Admission',
    icon: <Ticket className="w-5 h-5" />,
    description: 'Standard ticket for general access to the event',
    data: {
      name: 'General Admission',
      description: 'Full access to the event',
      price: 30,
      totalQuantity: 100,
      isPublished: true,
      sortOrder: 0,
      ticketType: 'GENERAL',
      isRaffleTicket: false,
      guestCount: 1
    }
  },
  {
    id: 'vip',
    name: 'VIP Access',
    icon: <Crown className="w-5 h-5" />,
    description: 'Premium seating and exclusive perks',
    data: {
      name: 'VIP Access',
      description: 'Premium seating, exclusive lounge access, and complimentary refreshments',
      price: 150,
      totalQuantity: 25,
      isPublished: true,
      sortOrder: 1,
      ticketType: 'GENERAL',
      isRaffleTicket: false,
      guestCount: 1
    }
  },
  {
    id: 'early-bird',
    name: 'Early Bird Special',
    icon: <Zap className="w-5 h-5" />,
    description: 'Discounted price for early registrants',
    data: {
      name: 'Early Bird Special',
      description: 'Limited time discount for early registrations',
      price: 50,
      totalQuantity: 50,
      isPublished: true,
      sortOrder: 2,
      ticketType: 'GENERAL',
      isRaffleTicket: false,
      guestCount: 1
    }
  },
  {
    id: 'group',
    name: 'Group Package',
    icon: <Users className="w-5 h-5" />,
    description: 'Discounted rate for groups of 10 or more',
    data: {
      name: 'Group Package',
      description: 'Special pricing for groups of 10 or more attendees',
      price: 800,
      totalQuantity: 20,
      isPublished: true,
      sortOrder: 3,
      ticketType: 'GENERAL',
      isRaffleTicket: false,
      guestCount: 1
    }
  },
  {
    id: 'volunteer',
    name: 'Volunteer Pass',
    icon: <Radio className="w-5 h-5" />,
    description: 'Complimentary access for event volunteers',
    data: {
      name: 'Volunteer Pass',
      description: 'Free access for registered event volunteers',
      price: 0,
      totalQuantity: 50,
      isPublished: true,
      sortOrder: 4,
      ticketType: 'GENERAL',
      isRaffleTicket: false,
      guestCount: 1
    }
  }
]
