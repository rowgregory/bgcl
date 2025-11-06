// Enums
export enum Role {
  PARENT = "PARENT",
  YOUTH = "YOUTH",
  STAFF = "STAFF",
  VOLUNTEER = "VOLUNTEER",
  ADMIN = "ADMIN",
  SUPERUSER = "SUPERUSER",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NON_BINARY = "NON_BINARY",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
  OTHER = "OTHER",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
  SEPARATED = "SEPARATED",
  DOMESTIC_PARTNERSHIP = "DOMESTIC_PARTNERSHIP",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

export enum YesNo {
  YES = "YES",
  NO = "NO",
}

// User Interface
export interface IUser {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: Date | null;
  lastLoginAt?: Date | null;
  hasLoginAccess: boolean;

  parent?: IParent | null;
  youth?: IYouth | null;
  staff?: IStaff | null;
  admin?: IAdmin | null;
}

// Parent Interface
export interface IParent {
  id: string;
  userId: string;
  user?: IUser;

  firstName: string;
  lastName: string;
  phone?: string | null;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  maritalStatus?: MaritalStatus | null;
  employer?: string | null;
  employerPhone?: string | null;
  annualHouseholdIncome?: string | null;
  hasHouseholdMembersOver65?: boolean | null;
  hasHouseholdMembersHandicapped?: boolean | null;
  currentHeadOfHousehold?: Gender | null;
  isCurrentSingleParent?: YesNo | null;
  howManyInHousehold?: string | null;
  howManyUnder18InHousehold?: string | null;
  militaryBranch?: string | null;
  isHouseholdOnMilitaryBase?: YesNo | null;

  addresses?: IAddress[];
  children?: IYouth[];

  createdAt: Date;
  updatedAt: Date;
}

// Youth Interface
export interface IYouth {
  id: string;
  userId: string;
  user?: IUser;

  parentId: string;
  parent?: IParent;

  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender?: Gender | null;

  // School
  school?: string | null;
  schoolTeacher?: string | null;
  schoolGrade?: string | null;

  // Demographics
  race?: string | null;
  ethnicity?: string | null;

  // Permissions
  canAppearInMedia?: boolean | null;
  canParticipateOnOffPremises?: boolean | null;

  // Special needs
  hasDisabilityIEP504?: string | null;
  isEnglishLanguageLearner?: boolean | null;

  // Program
  transportationPlan?: string | null;
  attendanceSchedule?: string | null;

  // Health
  physicalRecordsVerified?: boolean | null;
  canAdministerCPRFirstAid?: boolean | null;
  covidVaxStatus?: string | null;
  canSwim?: boolean | null;

  // Living situation
  livesWithMom?: boolean | null;
  livesWithDad?: boolean | null;
  livesWithGrandparents?: boolean | null;
  livesWithStepmother?: boolean | null;
  livesWithStepfather?: boolean | null;
  livesWithFoster?: boolean | null;
  livesWithOther?: string | null;
  isHomeless?: boolean | null;
  isInFosterCare?: boolean | null;

  requiresPGPickup?: boolean | null;

  createdAt: Date;
  updatedAt: Date;
}

// Staff Interface
export interface IStaff {
  id: string;
  userId: string;
  user?: IUser;

  firstName: string;
  lastName: string;
  phone?: string | null;
  position?: string | null;
  department?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

// Admin Interface
export interface IAdmin {
  id: string;
  userId: string;
  user?: IUser;

  firstName: string;
  lastName: string;
  phone?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

// Address Interface (referenced in Parent)
export interface IAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type?: string | null;
  parentId: string;
  parent?: IParent;
  createdAt: Date;
  updatedAt: Date;
}
