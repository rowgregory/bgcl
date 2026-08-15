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
import { setToggleModal } from '../actions/page/setToggleModal'
import {
  useCampaignDrawer,
  useEventDrawer,
  useProgramDrawer,
  useTeamMemberDrawer,
  useUserDrawer
} from '@/stores/drawers'

export interface IActionItems {
  linkKey?: string
  action: string
  label: string
  icon: LucideIcon
  open?: (data: any) => void
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
}

const dropDownActionItems = (isModalEnabled: boolean): IActionItems[] => [
  {
    action: 'launch-program',
    label: 'Launch Program',
    icon: Rocket,
    open: useProgramDrawer.getState().open,

    linkKey: ''
  },
  {
    action: 'create-campaign',
    label: 'Initiate Campaign',
    icon: Fuel,
    open: useCampaignDrawer.getState().open,

    linkKey: '/admin/fuel-tank/overview'
  },
  {
    action: 'toggle-modal',
    label: 'Toggle Modal',
    icon: isModalEnabled ? ToggleRight : ToggleLeft,
    open: async () => await setToggleModal('home')
  },
  {
    action: 'create-event',
    label: 'Create Event',
    icon: Satellite,
    open: useEventDrawer.getState().open,

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
        initial: { role: 'officer' }
      },
      {
        action: 'appoint-director',
        label: 'Appoint Director',
        icon: Crown,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'director' }
      },
      {
        action: 'station-corporator',
        label: 'Station Corporator',
        icon: Crown,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'corporator' }
      },
      {
        action: 'add-staff',
        label: 'Assign Admin Staff',
        icon: Radio,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'admin_staff' }
      },
      {
        action: 'dispatch-program-staff',
        label: 'Dispatch Program Staff',
        icon: Radio,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'program_staff' }
      },
      {
        action: 'mobilize-maintenance-staff',
        label: 'Mobilize Maintenance Staff',
        icon: Radio,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'maintenance_staff' }
      },
      {
        action: 'add-honoree',
        label: 'Induct Honoree',
        icon: Star,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'honoree' }
      },
      {
        action: 'add-youth-of-year',
        label: 'Crown Youth of Year',
        icon: Trophy,
        open: useTeamMemberDrawer.getState().open,
        formName: 'teamMemberForm',
        initial: { role: 'youth' }
      }
    ]
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
        initial: { role: 'ADMIN' }
      },
      {
        action: 'activate-program',
        label: 'Create Program Staff',
        icon: Crown,
        open: useUserDrawer.getState().open,
        formName: 'userForm',
        initial: { role: 'PROGRAM' }
      }
    ]
  }
]

export default dropDownActionItems
