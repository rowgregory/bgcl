import { JobApplicationWithReferences } from '@/types/job-application.types'
import { createDrawerStore } from './createDrawerStore'
import { CancelSubscriptionDetails } from '@/app/(authenticated)/supporter/_types/subscription.types'
import { CampaignWithCount } from '@/types/campaign.types'
import { News } from '@/types/news.types'
import { Closing } from '@/types/closing.types'
import { Resource } from '@/types/resource.types'
import { FailedPayment } from '@/types/failed-payment.types'
import { DonationWithRelations } from '@/app/(authenticated)/admin/donations/_types/donation.types'
import { EventWithTickets } from '@/types/event.types'
import { SelectableTicket } from '@/types/ticket.types'
import { UserWithAddress } from '@/types/user.types'
import { Newsletter } from '@/types/newsletter.types'
import { ProgramRecord } from '@/types/program.types'
import { TeamMemberRecord } from '@/types/team-member.types'

export const useVolunteerDrawer = createDrawerStore()
export const useCampaignDrawer = createDrawerStore<CampaignWithCount>()
export const useCartDropdown = createDrawerStore()
export const useProgramDrawer = createDrawerStore<ProgramRecord>()
export const useNewsDrawer = createDrawerStore<News>()
export const useNewsletterDrawer = createDrawerStore<Newsletter>()
export const useResourceDrawer = createDrawerStore<Resource>()
export const useClosingDrawer = createDrawerStore<Closing>()
export const useJobApplicationDrawer = createDrawerStore<JobApplicationWithReferences>()
export const useCancelSubscriptionDrawer = createDrawerStore<CancelSubscriptionDetails>()
export const usePartnerDrawer = createDrawerStore()
export const useEventDrawer = createDrawerStore<EventWithTickets>()
export const useYouthOfTheYearDrawer = createDrawerStore()
export const useFailedPaymentDrawer = createDrawerStore<FailedPayment[]>()
export const useDonationDrawer = createDrawerStore<DonationWithRelations>()
export const useTicketSelectionDrawer = createDrawerStore<SelectableTicket>()
export const useUserDrawer = createDrawerStore<UserWithAddress>()
export const useTeamMemberDrawer = createDrawerStore<TeamMemberRecord>()
