// types/event.ts
import { Event, Ticket, Order } from "@prisma/client";

export enum EventStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  POSTPONED = "POSTPONED",
}

// Base Event interface (matches Prisma model exactly)
export type IEvent = Event;

// Event with tickets
export interface EventWithTickets extends Event {
  tickets: Ticket[];
}

// Event with tickets and orders
export interface EventWithTicketsAndOrders extends Event {
  tickets: Ticket[];
  orders: Array<
    Order & {
      orderItems: Array<{
        id: string;
        quantity: number;
        pricePerUnit: number;
        totalPrice: number;
        ticketName: string;
        ticketDescription: string | null;
      }>;
    }
  >;
}

// Event with user
export interface EventWithUser extends Event {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
}

// Complete event with all relations
export interface EventWithAllRelations extends Event {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
  tickets: Ticket[];
  orders: Array<
    Order & {
      orderItems: Array<{
        id: string;
        quantity: number;
        pricePerUnit: number;
        totalPrice: number;
        ticketName: string;
        ticketDescription: string | null;
      }>;
    }
  >;
}

// Create Event Input
export interface ICreateEvent {
  title: string;
  description?: string;
  category: string;
  type: string;
  dresscode?: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  maxAttendees?: number;
  status?: EventStatus;
  featured?: boolean;
  host?: string;
  requirements?: string;
  materials?: string;
  registrationUrl?: string;
  meetingUrl?: string;
  isPublic?: boolean;
  requiresRSVP?: boolean;
  registrationDeadline?: Date;
  allowMultipleTickets?: boolean;
  salesStartDate?: Date;
  salesEndDate?: Date;
  userId: string;
}

// Update Event Input
export interface IUpdateEvent {
  title?: string;
  description?: string | null;
  category?: string;
  type?: string;
  dresscode?: string | null;
  date?: Date;
  time?: string;
  duration?: string;
  location?: string;
  maxAttendees?: number | null;
  attendees?: number;
  status?: EventStatus;
  featured?: boolean;
  host?: string | null;
  requirements?: string | null;
  materials?: string | null;
  registrationUrl?: string | null;
  meetingUrl?: string | null;
  isPublic?: boolean;
  requiresRSVP?: boolean;
  registrationDeadline?: Date;
  allowMultipleTickets?: boolean;
  salesStartDate?: Date | null;
  salesEndDate?: Date | null;
}

// Event with computed ticket stats
export interface IEventWithStats extends Event {
  totalTickets: number;
  ticketsSold: number;
  ticketsAvailable: number;
  totalRevenue: number;
  hasTickets: boolean;
  isSoldOut: boolean;
  isOnSale: boolean;
}

// Initial state for creating events
export const initialEventState: Omit<
  IEvent,
  "id" | "createdAt" | "updatedAt" | "userId"
> = {
  title: "",
  description: null,
  category: "",
  type: "",
  dresscode: null,
  date: new Date(),
  time: "18:00",
  duration: "2 hours",
  location: "",
  maxAttendees: null,
  attendees: 0,
  status: EventStatus.UPCOMING,
  featured: false,
  host: null,
  requirements: null,
  materials: null,
  registrationUrl: null,
  meetingUrl: null,
  viewCount: 0,
  clickCount: 0,
  isPublic: true,
  requiresRSVP: false,
  registrationDeadline: new Date(),
  allowMultipleTickets: false,
  salesStartDate: null,
  salesEndDate: null,
};

// Helper functions
export const isEventOnSale = (event: IEvent): boolean => {
  const now = new Date();
  const salesStart = event.salesStartDate
    ? new Date(event.salesStartDate)
    : null;
  const salesEnd = event.salesEndDate ? new Date(event.salesEndDate) : null;

  if (salesStart && now < salesStart) return false;
  if (salesEnd && now > salesEnd) return false;

  return true;
};

export const isEventUpcoming = (event: IEvent): boolean => {
  return (
    event.status === EventStatus.UPCOMING && new Date(event.date) > new Date()
  );
};

export const isEventPast = (event: IEvent): boolean => {
  return (
    event.status === EventStatus.COMPLETED || new Date(event.date) < new Date()
  );
};

export const getEventStatus = (event: IEvent): string => {
  const eventDate = new Date(event.date);
  const now = new Date();

  if (event.status === EventStatus.CANCELLED) return "Cancelled";
  if (event.status === EventStatus.POSTPONED) return "Postponed";
  if (eventDate < now) return "Past";
  if (event.status === EventStatus.ONGOING) return "Ongoing";
  return "Upcoming";
};
