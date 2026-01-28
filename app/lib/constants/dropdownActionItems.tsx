import {
  BookOpen,
  Crown,
  LucideIcon,
  Maximize2,
  Minimize2,
  Radio,
  Rocket,
  Satellite,
  Shield,
  Star,
  Trophy
} from 'lucide-react'
import { setOpenProgramDrawer } from '@/app/lib/store/slices/programSlice'
// import { setOpenEventDrawer } from '@/app/lib/store/slices/eventSlice'
import { setOpenTeamMemberDrawer } from '../store/slices/teamMemberSlice'
import { setOpenUserDrawer } from '../store/slices/userSlice'
import { setOpenCampaignDrawer } from '../store/slices/campaignSlice'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
import { setToggleModal } from '../actions/setToggleModal'

type ActionHandler = ActionCreatorWithoutPayload | (() => void) | ((slug: string) => Promise<any>)

export interface IActionItems {
  linkKey?: string
  action: string
  label: string
  icon: LucideIcon
  open?: ActionHandler
  isUnlocked: boolean
  hasSubmenu?: boolean
  submenu?: SubMenuItem[]
}

export interface SubMenuItem {
  action: string
  label: string
  icon: LucideIcon
  open: any
  formName: string
  initial: any
  isUnlocked: boolean
}

const dropDownActionItems = (isModalEnabled: boolean): IActionItems[] => [
  {
    action: 'launch-program',
    label: 'Launch Program',
    icon: Rocket,
    open: setOpenProgramDrawer,
    isUnlocked: true,
    linkKey: ''
  },
  {
    action: 'create-campaign',
    label: 'Initiate Campaign',
    icon: Satellite,
    open: setOpenCampaignDrawer,
    isUnlocked: true,
    linkKey: '/admin/fuel-tank/overview'
  },
  {
    action: 'toggle-modal',
    label: 'Toggle Modal',
    icon: isModalEnabled ? Maximize2 : Minimize2,
    open: async () => await setToggleModal('home'),
    isUnlocked: true
  },
  // {
  //   action: 'manage-events',
  //   label: 'Create Event',
  //   icon: Satellite,
  //   open: setOpenEventDrawer,
  //   isUnlocked: true,
  //   linkKey: '/admin/capsule/core'
  // },
  {
    action: 'the-library',
    label: 'The Library',
    icon: BookOpen,
    hasSubmenu: true,
    submenu: [
      {
        action: 'deploy-officer',
        label: 'Deploy Officer',
        icon: Crown,
        open: setOpenTeamMemberDrawer,
        formName: 'teamMemberForm',
        initial: { role: 'officer' },
        isUnlocked: true
      },
      {
        action: 'appoint-director',
        label: 'Appoint Director',
        icon: Crown,
        open: setOpenTeamMemberDrawer,
        formName: 'teamMemberForm',
        initial: { role: 'director' },
        isUnlocked: true
      },
      {
        action: 'station-corporator',
        label: 'Station Corporator',
        icon: Crown,
        open: setOpenTeamMemberDrawer,
        formName: 'teamMemberForm',
        initial: { role: 'corporator' },
        isUnlocked: true
      },
      {
        action: 'add-staff',
        label: 'Assign Admin Staff',
        icon: Radio,
        open: setOpenTeamMemberDrawer,
        formName: 'teamMemberForm',
        initial: { role: 'admin_staff' },
        isUnlocked: true
      },
      {
        action: 'dispatch-program-staff',
        label: 'Dispatch Program Staff',
        icon: Radio,
        open: setOpenTeamMemberDrawer,
        formName: 'teamMemberForm',
        initial: { role: 'program_staff' },
        isUnlocked: true
      },
      {
        action: 'mobilize-maintenance-staff',
        label: 'Mobilize Maintenance Staff',
        icon: Radio,
        open: setOpenTeamMemberDrawer,
        formName: 'teamMemberForm',
        initial: { role: 'maintenance_staff' },
        isUnlocked: true
      },
      {
        action: 'add-honoree',
        label: 'Induct Honoree',
        icon: Star,
        open: setOpenTeamMemberDrawer,
        formName: 'teamMemberForm',
        initial: { role: 'honoree' },
        isUnlocked: true
      },
      {
        action: 'add-youth-of-year',
        label: 'Crown Youth of Year',
        icon: Trophy,
        open: setOpenTeamMemberDrawer,
        formName: 'teamMemberForm',
        initial: { role: 'youth' },
        isUnlocked: true
      }
    ],
    isUnlocked: true
  },
  {
    action: 'command-pod',
    label: 'Command Pod',
    icon: Shield,
    hasSubmenu: true,
    submenu: [
      {
        action: 'activate-admin',
        label: 'Activate Admin',
        icon: Crown,
        open: setOpenUserDrawer,
        formName: 'userForm',
        initial: { role: 'ADMIN' },
        isUnlocked: true
      },
      {
        action: 'activate-program',
        label: 'Create Program Staff',
        icon: Crown,
        open: setOpenUserDrawer,
        formName: 'userForm',
        initial: { role: 'PROGRAM' },
        isUnlocked: true
      }
    ],
    isUnlocked: true
  }
]

export default dropDownActionItems

// {
//   "hero": {
//     "heading": "Great Futures Start Here",
//     "bodyText": "Inspiring and enabling all young people to realize their full potential",
//     "button1Link": "/donate",
//     "button1Text": "Donate",
//     "button2Link": "https://parentportal.bgcl.org/",
//     "button2Text": "Parent Portal"
//   },
//   "modal": {
//     "heading": "Summer Registration Opens February 2nd! ",
//     "subheading": "Enroll your child now in our quality summer programs designed to inspire growth, learning, and community.",
//     "button1Link": "https://parentportal.bgcl.org/",
//     "button1Text": "Save The Date! ",
//     "button2Text": "Enrollment Opens at 12pm "
//   },
//   "youth": {
//     "heading1": "Meet",
//     "heading2": "Divine",
//     "subheading": "Award Winner"
//   },
//   "history": {
//     "statOne": {
//       "value1": "1889",
//       "value2": "Club Founded",
//       "value3": "One of the first twenty clubs in America"
//     },
//     "statTwo": {
//       "value1": "1,500+",
//       "value2": "Members Today",
//       "value3": "Ages 5-18 with 50/50 gender ratio"
//     },
//     "heading1": "History",
//     "heading2": "of BGCL",
//     "statThree": {
//       "value1": "$24.5M",
//       "value2": "Phase 2 Capital Project",
//       "value3": "Opening January 2027"
//     },
//     "paragraph1": "In 1889, the Boys Club of Lynn was formed which made it one of the first twenty clubs across America to be established. Evolving into the 1930's, our building that resides at 25 North Common Street opened its doors to our club members. Transitioning into 1991, the Boys Club then changed its name to the Boys & Girls Club of Lynn.",
//     "paragraph2": "Presently, the Boys & Girls Club of Lynn has a 50/50 female to male ratio that serves all youth ages 5-18 years old. We serve over 1,500 members and have more than 250 children walk through our doors on a daily basis. Most recently, our building underwent a $6.4 million renovation to enhance and modernize its amenities for our members to truly experience a state of the art facility.",
//     "paragraph3": "In June of 2025, we will be embarking on our Phase 2 Capital project. This will be an $18 million project with a 14-month renovation that will unveil our new and improved facility by January 2027. Due to the growth and success of our programs, we have reached capacity. This improvement will enable us to flourish, increase enrollment, and eliminate our waitlists.",
//     "paragraph4": "In addition, we will have the opportunity to expand our network allowing more community partners to utilize the new and improved amenities within our facility. The following upgrades will impact the Drop-In Center, Kids Club, and Teen Center. Such amenities will include a new pool, new game room, updated gym, larger Planet Fitness gym, enhanced dance studio space, a Commercial Kitchen, 2 new Licensed OST classrooms, a Teen wing including a Keystone room, as well as a new gymnasium for our younger members including a theater space.",
//     "subheading": "Our Journey"
//   },
//   "mission": {
//     "heading": "Our Mission",
//     "bodyText": "To inspire and enable all young people, especially those that need us the most, to realize their full potential as productive responsible and caring citizens.",
//     "subheading": "Our purpose",
//     "button1Text": "Volunteer",
//     "button2Link": "/donate",
//     "button2Text": "Donate"
//   },
//   "facility": {
//     "heading1": "Building",
//     "heading2": "the Future",
//     "paragraph1": "The Boys & Girls Club of Lynn recently underwent a $6.4 million dollar renovation in 2020. With the support of our many donors, we were able to complete a big portion of our building renovation. We are proud to offer the following new additions to our facility: Dance Studio, STEAM Lab, Planet Fitness Gym, Teen Center, Gaming Room, as well as a Technology Center.",
//     "paragraph2": "The club also has a new and improved lobby area, Board Room, multiple office space for our staff, bathrooms, registration areas and more! Our Kids Club and Afterschool program spaces have been fully renovated as well! At our Kids Club, we offer 3 dedicated classrooms, a huge open play and activity area along with a tower garden for our little members to explore and delve into the art of gardening.",
//     "paragraph3": "Our newly enhanced After School Drop In Center is equipped with a dedicated Teen area as well as the aforementioned STEAM Lab, Gym, Dance Studio, Gaming area and also a Tower Garden for our older members to test out their gardening skills! Over the next 5-6 years, we will be heading into Phase 2 of our renovations. We are looking forward to offering a Culinary program, Preschool, new Gym, and more! ",
//     "subheading": "Our Transformation"
//   },
//   "programs": {
//     "heading1": "Building",
//     "heading2": "Skills for Tomorrow",
//     "subheading": "Our programs"
//   }
// }
