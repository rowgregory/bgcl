import { Role } from '@/types/entities/user'

export const initialUserFormState = {
  id: '',
  email: '',
  role: Role.ADMIN,
  firstName: null,
  lastName: null,
  phone: null,
  position: null,
  department: null,
  staffStatus: null
}
