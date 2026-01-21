import { IActionItems } from '@/types/navigation'
import { BookOpen, Crown, Radio, Rocket, Satellite, Shield, Star, Trophy } from 'lucide-react'
import { setOpenProgramDrawer } from '@/app/lib/store/slices/programSlice'
// import { setOpenEventDrawer } from '@/app/lib/store/slices/eventSlice'
import { setOpenTeamMemberDrawer } from '../store/slices/teamMemberSlice'
import { setOpenUserDrawer } from '../store/slices/userSlice'
import { setOpenCampaignDrawer } from '../store/slices/campaignSlice'

const dropDownActionItems: IActionItems[] = [
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
      }
    ],
    isUnlocked: true
  }
]

export default dropDownActionItems
