import { PositionType } from '@prisma/client'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

export const FORM_STEPS = [
  {
    id: 1,
    name: 'Position & Background',
    fields: ['positionTypes', 'youthOrgEmployment', 'education', 'extracurricularsSkills']
  },
  {
    id: 2,
    name: 'Personal Info',
    fields: ['applicantName', 'email', 'employmentType', 'hoursAvailable', 'languages']
  },
  { id: 3, name: 'References', fields: ['references'] },
  {
    id: 4,
    name: 'Driving Info',
    fields: [
      'hasValidDriverLicense',
      'licenseNumber',
      'licenseExpiration',
      'noLicenseReason',
      'licenseSuspended',
      'suspensionExplanation',
      'trafficViolations'
    ]
  },
  { id: 5, name: 'Resume', fields: ['resumeUrl'] },
  {
    id: 6,
    name: 'Certification',
    fields: ['agreeToTerms', 'certifyInformation', 'authorizeBackground', 'understandActiveStatus', 'signature']
  }
]

export const certificationText = [
  {
    title: 'Equal Opportunity Employer',
    content:
      'The Boys & Girls Club of Lynn is an equal opportunity employer. Applicants are considered for positions without regard to veteran status, uniformed service member status, race, color, religion, sex, national origin, age, physical or mental disability, genetic information or any other category protected by applicable federal, state, or local laws.'
  },
  {
    title: 'Information Accuracy',
    content:
      'I certify that all the information on this application, my resume, or any supporting documents I may present during any interview is and will be complete and accurate to the best of my knowledge. I understand that any falsification, misrepresentation, or omission of any information may result in disqualification from consideration for employment or, if employed, disciplinary action, up to and including immediate dismissal.'
  },
  {
    title: 'At-Will Employment',
    content:
      'THE BOYS & GIRLS CLUB OF LYNN IS AN AT-WILL EMPLOYER AS ALLOWED BY APPLICABLE STATE LAW. THIS MEANS THAT REGARDLESS OF ANY PROVISION IN THIS APPLICATION, IF HIRED, THE BOYS & GIRLS CLUB OF LYNN OR I MAY TERMINATE THE EMPLOYMENT RELATIONSHIP AT ANY TIME, FOR ANY REASON, WITH OR WITHOUT CAUSE OR NOTICE. NOTHING IN THIS APPLICATION OR IN ANY DOCUMENT OR STATEMENT, WRITTEN OR ORAL, SHALL LIMIT THE RIGHT TO TERMINATE EMPLOYMENT AT-WILL. NO OFFICER, EMPLOYEE OR REPRESENTATIVE OF THE BOYS & GIRLS CLUB OF LYNN IS AUTHORIZED TO ENTER INTO AN AGREEMENT-EXPRESS OR IMPLIED-WITH ME OR ANY APPLICANT FOR EMPLOYMENT FOR A SPECIFIED PERIOD OF TIME UNLESS SUCH AN AGREEMENT IS IN A WRITTEN CONTRACT SIGNED BY THE PRESIDENT OF THE BOYS & GIRLS CLUB OF LYNN. IF HIRED, I AGREE TO CONFORM TO THE RULES AND REGULATIONS OF THE BOYS & GIRLS CLUB OF LYNN, AND I UNDERSTAND THAT THE BOYS & GIRLS CLUB OF LYNN HAS COMPLETE DISCRETION TO MODIFY SUCH RULES AND REGULATIONS AT ANY TIME, EXCEPT THAT IT WILL NOT MODIFY THIS POLICY OF EMPLOYMENT AT-WILL.'
  },
  {
    title: 'Background Investigation Authorization',
    content:
      'I authorize the Boys & Girls Club of Lynn or its agents to confirm all statements contained in this application and/or resume as it relates to the position, I am seeking to the extent permitted by federal, state, or local law. I agree to complete any requisite authorization forms for the background investigation which may be permitted by federal, state and/or local law.'
  },
  {
    title: 'Legal Work Authorization',
    content:
      'If hired by the Boys & Girls Club of Lynn, I understand that I will be required to provide genuine documentation establishing my identity and eligibility to be legally employed in the United States by the Boys & Girls Club of Lynn. I also understand that the Boys & Girls Club of Lynn employs only individuals who are legally eligible to work in the United States.'
  },
  {
    title: 'Active Application Status',
    content:
      'THIS APPLICATION WILL BE CONSIDERED ACTIVE FOR A MAXIMUM OF NINETY (90) DAYS. IF YOU WISH TO BE CONSIDERED FOR EMPLOYMENT AFTER THAT TIME, YOU MUST REAPPLY.'
  }
]

export const commonLanguages = [
  'English',
  'Spanish',
  'Mandarin',
  'French',
  'Vietnamese',
  'Portuguese',
  'Arabic',
  'ASL',
  'Cantonese',
  'Haitian Creole',
  'Italian',
  'Japanese',
  'Korean',
  'Tagalog'
]

export const hourOptions = [
  'Monday-Friday 9am-5pm',
  'Monday-Friday mornings (before 12pm)',
  'Monday-Friday afternoons (after 12pm)',
  'Weekends only',
  'Weekdays and weekends',
  'Flexible/As needed',
  'Summers only',
  'After school hours (3pm-6pm)',
  'Evenings (after 6pm)',
  'Custom schedule'
]

export const jobApplicationStatusConfig = {
  PENDING: {
    color: 'bg-yellow-500/10 border-yellow-500/30',
    textColor: 'text-yellow-400',
    icon: Clock,
    label: 'Under Review',
    description: 'Your application is being reviewed by our team.'
  },
  REVIEW: {
    color: 'bg-blue-500/10 border-blue-500/30',
    textColor: 'text-blue-400',
    icon: Clock,
    label: 'In Review',
    description: 'Your application is actively being reviewed.'
  },
  APPROVED: {
    color: 'bg-green-500/10 border-green-500/30',
    textColor: 'text-green-400',
    icon: CheckCircle,
    label: 'Approved',
    description: 'Congratulations! Your application has been approved.'
  },
  REJECTED: {
    color: 'bg-red-500/10 border-red-500/30',
    textColor: 'text-red-400',
    icon: AlertCircle,
    label: 'Not Selected',
    description: 'Thank you for applying. We will keep your application on file.'
  }
}

export const TABS = ['All', 'Pending', 'Review', 'Approved', 'Rejected']

export const TAB_TO_STATUS: Record<string, string> = {
  All: 'All',
  Pending: 'PENDING',
  Review: 'REVIEW',
  Approved: 'APPROVED',
  Rejected: 'REJECTED'
}

export const POSITION_LABELS: Record<PositionType, string> = {
  CAMP_COUNSELOR: 'Camp Counselor (seasonal)',
  LIFEGUARD: 'Life Guard (seasonal)',
  YOUTH_DEVELOPMENT_WORKER: 'Youth Development Worker/Group Leader (afterschool)',
  SEASONAL_SUMMER: 'Seasonal Summer'
}

export const POSITION_OPTIONS = Object.entries(POSITION_LABELS)
  .filter(([key]) => key !== 'SEASONAL_SUMMER')
  .map(([value, label]) => ({ value, label }))

export const STATUS_OPTIONS = ['PENDING', 'REVIEW', 'APPROVED', 'REJECTED'] as const

export const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  REVIEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
}
