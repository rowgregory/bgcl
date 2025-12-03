import { EventStatus, IEvent } from '@/types/entities/event'

// Initial state for creating events
export const initialEventState: Omit<IEvent, 'id' | 'createdAt' | 'updatedAt' | 'userId'> = {
  title: '',
  description: null,
  category: '',
  type: '',
  dresscode: null,
  date: new Date(),
  time: '18:00',
  duration: '2 hours',
  location: '',
  maxAttendees: null,
  status: EventStatus.UPCOMING,
  featured: false,
  host: null,
  requirements: null,
  materials: null,
  registrationUrl: null,
  meetingUrl: null,
  isPublic: true,
  requiresRSVP: false,
  registrationDeadline: new Date(),
  allowMultipleTickets: false,
  salesStartDate: null,
  salesEndDate: null,
  capacity: 0,
  attendeeCount: 0
}
