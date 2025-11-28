import { DefaultSession, DefaultUser } from "next-auth";

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: "PARENT" | "YOUTH" | "STAFF" | "VOLUNTEER" | "ADMIN" | "SUPERUSER";
    hasLoginAccess: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "PARENT" | "YOUTH" | "STAFF" | "VOLUNTEER" | "ADMIN" | "SUPERUSER";
      hasLoginAccess: boolean; // Add this if you need it in session
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "PARENT" | "YOUTH" | "STAFF" | "VOLUNTEER" | "ADMIN" | "SUPERUSER";
    hasLoginAccess: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: "PARENT" | "YOUTH" | "STAFF" | "VOLUNTEER" | "ADMIN" | "SUPERUSER";
    hasLoginAccess: boolean; // Add this if you need it in JWT
    name?: string;
  }
}
