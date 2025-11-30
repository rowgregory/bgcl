// app/admin/types.ts
import { Prisma, Hero } from "@prisma/client";
import { ReactNode } from "react";

// Exact type that matches the getAllUsers select
export type UserWithCounts = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    role: true;
    createdAt: true;
    updatedAt: true;
    lastLoginAt: true;
    firstName: true;
    lastName: true;
    phone: true;
    position: true;
    department: true;
    hireDate: true;
    staffStatus: true;
    _count: {
      select: {
        events: true;
        accounts: true;
        sessions: true;
      };
    };
  };
}>;

// Exact type that matches the getAllEvents include
export type EventWithUser = Prisma.EventGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        email: true;
        firstName: true;
        lastName: true;
        role: true;
      };
    };
  };
}>;

// Hero type from Prisma
export type HeroType = Hero;

// Session user type (adjust based on your auth setup)
export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface AdminStats {
  users: {
    total: number;
    supporters: number;
    staff: number;
    admins: number;
    growth: number;
  };
  events: {
    total: number;
    recentWeek: number;
  };
  heroes: {
    total: number;
    active: number;
    activeHeroId?: string;
  };
}

export interface AdminLayoutData {
  users: UserWithCounts[] | null; // Changed: allow null
  usersPagination: Pagination | null;
  events: EventWithUser[] | null; // Changed: allow null
  eventsPagination: Pagination | null;
  heroes: HeroType[] | null; // Changed: allow null
  stats: AdminStats | null;
  user: SessionUser | null; // Changed: allow null
}

export interface IAdminLayoutClient {
  children: ReactNode;
  data: AdminLayoutData;
}
