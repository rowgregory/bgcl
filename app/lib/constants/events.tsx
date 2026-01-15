import { EventTemplate } from '@/types/entities/event'
import { Sparkles, Briefcase, Users, Music, GraduationCap, Heart, Trophy, Utensils } from 'lucide-react'

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
  'Athletic'
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

export const templates: EventTemplate[] = [
  {
    id: 'gala',
    name: 'Gala Event',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Elegant evening gala event',
    data: {
      title: 'Annual Gala',
      description: 'Join us for an elegant evening of dinner, dancing, and celebration.',
      category: 'Fundraiser',
      type: EVENT_TYPES['IN_PERSON'],
      dresscode: 'Formal',
      time: '18:00',
      duration: '4 hours',
      location: 'Danvers Yacht Club',
      maxAttendees: '200',
      requirements: 'Registration Required, 21+ Only',
      materials: '',
      isPublic: true,
      requiresRSVP: true,
      allowMultipleTickets: true
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
      type: EVENT_TYPES['HYBRID'],
      dresscode: 'Business Professional',
      time: '08:00',
      duration: 'Full Day',
      location: 'Convention Center',
      maxAttendees: '500',
      requirements: 'Registration Required, Photo Release',
      materials: 'Laptop, Notebook, Business Cards',
      isPublic: true,
      requiresRSVP: true,
      allowMultipleTickets: false
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
      type: EVENT_TYPES['IN_PERSON'],
      dresscode: 'Business Casual',
      time: '17:30',
      duration: '2 hours',
      location: 'Local Restaurant & Bar',
      maxAttendees: '75',
      requirements: '18+ Only',
      materials: 'Business Cards',
      isPublic: true,
      requiresRSVP: true,
      allowMultipleTickets: false
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
      type: EVENT_TYPES['IN_PERSON'],
      dresscode: 'Casual',
      time: '19:00',
      duration: '3 hours',
      location: 'Music Venue',
      maxAttendees: '300',
      requirements: 'ID Required',
      materials: '',
      isPublic: true,
      requiresRSVP: false,
      allowMultipleTickets: true
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
      type: EVENT_TYPES['IN_PERSON'],
      dresscode: 'Casual',
      time: '09:00',
      duration: 'Half Day',
      location: 'Training Center',
      maxAttendees: '30',
      requirements: 'Registration Required, Pre-payment Required',
      materials: 'Laptop, Notebook, Pen/Pencil',
      isPublic: true,
      requiresRSVP: true,
      allowMultipleTickets: false
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
      type: EVENT_TYPES['IN_PERSON'],
      dresscode: 'Smart Casual',
      time: '18:30',
      duration: '3 hours',
      location: 'Community Hall',
      maxAttendees: '150',
      requirements: 'Registration Required',
      materials: '',
      isPublic: true,
      requiresRSVP: true,
      allowMultipleTickets: true
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
      type: EVENT_TYPES['IN_PERSON'],
      dresscode: 'Athletic',
      time: '10:00',
      duration: 'Full Day',
      location: 'Sports Complex',
      maxAttendees: '100',
      requirements: 'Registration Required, Liability Waiver',
      materials: 'Athletic Wear, Water Bottle',
      isPublic: true,
      requiresRSVP: true,
      allowMultipleTickets: false
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
      type: EVENT_TYPES['IN_PERSON'],
      dresscode: 'Business Casual',
      time: '19:00',
      duration: '2 hours',
      location: 'Upscale Restaurant',
      maxAttendees: '50',
      requirements: 'Registration Required, 21+ Only',
      materials: '',
      isPublic: true,
      requiresRSVP: true,
      allowMultipleTickets: false
    }
  }
]
