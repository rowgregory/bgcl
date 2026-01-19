export interface IReference {
  id?: string
  name: string
  positionAndCompany: string
  workRelationship: string
  phone: string
  email: string
}

export interface IJobApplication {
  id?: string
  applicantName: string
  email: string
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'SEASONAL'
  hoursAvailable: string
  languages: string[] | string
  references: IReference[]
  hasValidDriverLicense: boolean
  licenseNumber?: string
  licenseExpiration?: Date
  noLicenseReason?: string
  licenseSuspended: boolean
  suspensionExplanation?: string
  trafficViolations?: string
  resumeUrl?: string
  resumeFileName?: string
  resumeFileSize?: number
  resumeUploadedAt?: Date
  agreeToTerms: boolean
  certifyInformation: boolean
  authorizeBackground: boolean
  understandActiveStatus: boolean
  signature?: string
  status: 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED'
  submissionStatus: 'INCOMPLETE' | 'COMPLETE' | 'SUBMITTED'

  createdAt: Date
  updatedAt: Date
}
