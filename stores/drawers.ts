import { IJobApplication } from '@/types/entities/job-application'
import { createDrawerStore } from './createDrawerStore'

export const useVolunteerDrawer = createDrawerStore()
export const useCampaignDrawer = createDrawerStore()
export const useCartDropdown = createDrawerStore()
export const useProgramDrawer = createDrawerStore()
export const useNewsDrawer = createDrawerStore()
export const useNewsletterDrawer = createDrawerStore()
export const useClubResourceDrawer = createDrawerStore()
export const useClosingDrawer = createDrawerStore()
export const useJobApplicationDrawer = createDrawerStore<IJobApplication>()
export const useCancelSubscriptionDrawer = createDrawerStore<{
  subscriptionId: string
  subscriptionAmount: number
  nextBillingDate: string
}>()
