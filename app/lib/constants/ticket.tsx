import { TicketTemplate } from '@/types/entities/ticket'
import { Sparkles, Users, Crown, Zap, Gift, Clock, Shield, Ticket, TrendingUp, Radio } from 'lucide-react'

export const ticketTemplates: TicketTemplate[] = [
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
      isAvailable: true,
      sortOrder: 0
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
      price: 15000,
      totalQuantity: 25,

      isAvailable: true,
      sortOrder: 1
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
      price: 5000,
      totalQuantity: 50,

      isAvailable: true,
      sortOrder: 0
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
      price: 80000,
      totalQuantity: 20,
      isAvailable: true,
      sortOrder: 2
    }
  },
  {
    id: 'table-sponsorship',
    name: 'Table Sponsorship',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Premium table for 12 people with branding',
    data: {
      name: 'Table Sponsorship (12)',
      description: 'Includes 12 premium seats, table signage, and sponsor recognition',
      price: 180000,
      totalQuantity: 10,
      isAvailable: true,
      sortOrder: 3
    }
  },
  {
    id: 'student',
    name: 'Student Discount',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Special pricing for students with valid ID',
    data: {
      name: 'Student Discount',
      description: 'Valid student ID required at entry',
      price: 2500,
      totalQuantity: 75,
      isAvailable: true,
      sortOrder: 4
    }
  },
  {
    id: 'donor',
    name: 'Donor Recognition',
    icon: <Gift className="w-5 h-5" />,
    description: 'Reserved for major donors with premium benefits',
    data: {
      name: 'Donor Recognition',
      description: 'Premium access, VIP reception, and donor recognition in program',
      price: 250000,
      totalQuantity: 5,
      isAvailable: true,
      sortOrder: 5
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
      price: 10,
      totalQuantity: 50,
      isAvailable: true,
      sortOrder: 6
    }
  },
  {
    id: 'family-pack',
    name: 'Family Package',
    icon: <Users className="w-5 h-5" />,
    description: '4 tickets for families at a discounted rate',
    data: {
      name: 'Family Package (4)',
      description: 'Bundle of 4 tickets at family discount rate',
      price: 35000,
      totalQuantity: 40,

      isAvailable: true,
      sortOrder: 7
    }
  },
  {
    id: 'limited-edition',
    name: 'Limited Edition',
    icon: <Clock className="w-5 h-5" />,
    description: 'Exclusive tickets with limited availability',
    data: {
      name: 'Limited Edition',
      description: 'Exclusive numbered tickets with collectible value',
      price: 50000,
      totalQuantity: 10,

      isAvailable: true,
      sortOrder: 8
    }
  },
  {
    id: 'lifetime-member',
    name: 'Lifetime Member',
    icon: <Shield className="w-5 h-5" />,
    description: 'Exclusive membership with year-round benefits',
    data: {
      name: 'Lifetime Membership',
      description: 'Annual membership with unlimited event access and exclusive benefits',
      price: 500000,
      totalQuantity: 15,
      isAvailable: true,
      sortOrder: 9
    }
  }
]
