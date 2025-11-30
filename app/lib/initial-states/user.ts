import { Role } from "@/types/entities/user";

export const initialUserConfig = {
  id: "",
  email: "",
  role: Role.SUPPORTER,
  createdAt: new Date(),
  updatedAt: new Date(),
  emailVerified: null,
  lastLoginAt: null,
  hasLoginAccess: false,
  firstName: null,
  lastName: null,
  phone: null,
  position: null,
  department: null,
  hireDate: null,
  staffStatus: null,
  metadata: null,
};
