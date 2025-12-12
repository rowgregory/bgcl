import { IActionItems } from '@/types/navigation'
import {
  setOpenAddStaffDrawer,
  setOpenAnnouncementDrawer,
  setOpenDonationReportsDrawer,
  setOpenEventsManagerDrawer,
  setOpenProgramsManagerDrawer
} from '../../redux/features/adminSlice'
import { Rocket, Satellite, DollarSign, UserPlus, Radio } from 'lucide-react'

const adminActionItems: IActionItems[] = [
  {
    action: 'launch-program',
    label: 'Launch Program',
    icon: Rocket,
    open: setOpenProgramsManagerDrawer,
    isUnlocked: true,
    linkKey: ''
  },
  {
    action: 'manage-events',
    label: 'Manage Events',
    icon: Satellite,
    open: setOpenEventsManagerDrawer,
    isUnlocked: true,
    linkKey: '/admin/events'
  },
  {
    action: 'donation-reports',
    label: 'Donation Reports',
    icon: DollarSign,
    open: setOpenDonationReportsDrawer,
    isUnlocked: true,
    linkKey: '/admin/donations'
  },
  {
    action: 'add-staff',
    label: 'Add Staff Member',
    icon: UserPlus,
    open: setOpenAddStaffDrawer,
    isUnlocked: true,
    linkKey: '/admin/staff'
  },
  {
    action: 'send-announcement',
    label: 'Send Announcement',
    icon: Radio,
    open: setOpenAnnouncementDrawer,
    isUnlocked: true,
    linkKey: '/admin/announcement'
  }
]

export default adminActionItems
