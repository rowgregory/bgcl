import {
  BookOpen,
  Crown,
  Fuel,
  LucideIcon,
  Radio,
  Rocket,
  Satellite,
  Shield,
  Star,
  ToggleLeft,
  ToggleRight,
  Trophy
} from 'lucide-react'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
import { setToggleModal } from '../actions/page/setToggleModal'
import {
  useCampaignDrawer,
  useEventDrawer,
  useProgramDrawer,
  useTeamMemberDrawer,
  useUserDrawer
} from '@/stores/drawers'

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
    open: useProgramDrawer.getState().open,
    isUnlocked: true,
    linkKey: ''
  },
  {
    action: 'create-campaign',
    label: 'Initiate Campaign',
    icon: Fuel,
    open: useCampaignDrawer.getState().open,
    isUnlocked: true,
    linkKey: '/admin/fuel-tank/overview'
  },
  {
    action: 'toggle-modal',
    label: 'Toggle Modal',
    icon: isModalEnabled ? ToggleRight : ToggleLeft,
    open: async () => await setToggleModal('home'),
    isUnlocked: true
  },
  {
    action: 'create-event',
    label: 'Create Event',
    icon: Satellite,
    open: useEventDrawer.getState().open,
    isUnlocked: true,
    linkKey: '/admin/events/overview'
  },
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
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'officer' },
        isUnlocked: true
      },
      {
        action: 'appoint-director',
        label: 'Appoint Director',
        icon: Crown,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'director' },
        isUnlocked: true
      },
      {
        action: 'station-corporator',
        label: 'Station Corporator',
        icon: Crown,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'corporator' },
        isUnlocked: true
      },
      {
        action: 'add-staff',
        label: 'Assign Admin Staff',
        icon: Radio,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'admin_staff' },
        isUnlocked: true
      },
      {
        action: 'dispatch-program-staff',
        label: 'Dispatch Program Staff',
        icon: Radio,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'program_staff' },
        isUnlocked: true
      },
      {
        action: 'mobilize-maintenance-staff',
        label: 'Mobilize Maintenance Staff',
        icon: Radio,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'maintenance_staff' },
        isUnlocked: true
      },
      {
        action: 'add-honoree',
        label: 'Induct Honoree',
        icon: Star,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'honoree' },
        isUnlocked: true
      },
      {
        action: 'add-youth-of-year',
        label: 'Crown Youth of Year',
        icon: Trophy,
        open: useTeamMemberDrawer.getState().open,
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
        open: useUserDrawer.getState().open,
        formName: 'userForm',
        initial: { role: 'ADMIN' },
        isUnlocked: true
      },
      {
        action: 'activate-program',
        label: 'Create Program Staff',
        icon: Crown,
        open: useUserDrawer.getState().open,
        formName: 'userForm',
        initial: { role: 'PROGRAM' },
        isUnlocked: true
      }
    ],
    isUnlocked: true
  }
]

export default dropDownActionItems
