import { IActionItems } from "@/types/navigation";
import {
  setOpenAddStaffDrawer,
  setOpenAnnouncementDrawer,
  setOpenDonationReportsDrawer,
  setOpenEnrollmentsViewDrawer,
  setOpenEventsManagerDrawer,
  setOpenFamiliesViewDrawer,
  setOpenProgramsManagerDrawer,
} from "../../redux/features/adminSlice";
import {
  Users,
  ClipboardList,
  Rocket,
  Satellite,
  DollarSign,
  UserPlus,
  Radio,
} from "lucide-react";

const adminActionItems: IActionItems[] = [
  {
    action: "view-families",
    label: "View All Families",
    icon: Users,
    open: setOpenFamiliesViewDrawer,
    isUnlocked: true,
    linkKey: "/admin/families",
  },
  {
    action: "view-enrollments",
    label: "View Enrollments",
    icon: ClipboardList,
    open: setOpenEnrollmentsViewDrawer,
    isUnlocked: true,
    linkKey: "/admin/enrollments",
  },
  {
    action: "manage-programs",
    label: "Manage Programs",
    icon: Rocket,
    open: setOpenProgramsManagerDrawer,
    isUnlocked: true,
    linkKey: "/admin/programs",
  },
  {
    action: "manage-events",
    label: "Manage Events",
    icon: Satellite,
    open: setOpenEventsManagerDrawer,
    isUnlocked: true,
    linkKey: "/admin/events",
  },
  {
    action: "donation-reports",
    label: "Donation Reports",
    icon: DollarSign,
    open: setOpenDonationReportsDrawer,
    isUnlocked: true,
    linkKey: "/admin/donations",
  },
  {
    action: "add-staff",
    label: "Add Staff Member",
    icon: UserPlus,
    open: setOpenAddStaffDrawer,
    isUnlocked: true,
    linkKey: "/admin/staff",
  },
  {
    action: "send-announcement",
    label: "Send Announcement",
    icon: Radio,
    open: setOpenAnnouncementDrawer,
    isUnlocked: true,
    linkKey: "/admin/announcement",
  },
];

export default adminActionItems;
