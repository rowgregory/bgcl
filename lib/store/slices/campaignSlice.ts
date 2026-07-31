import { ICampaign } from '@/types/entities/campaign'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CampaignState {
  campaign: ICampaign | null
  campaigns: ICampaign[]
  campaignDrawer: boolean
}

const initialState: CampaignState = {
  campaign: null,
  campaigns: [],
  campaignDrawer: false
}

export const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setCampaign: (state, action: PayloadAction<ICampaign | null>) => {
      state.campaign = action.payload
    },
    hydrateCampaigns: (state, action) => {
      state.campaigns = action.payload
    },
    setOpenCampaignDrawer: (state) => {
      state.campaignDrawer = true
    },
    setCloseCampaignDrawer: (state) => {
      state.campaignDrawer = false
    }
  }
})

export const { setCampaign, hydrateCampaigns, setOpenCampaignDrawer, setCloseCampaignDrawer } = campaignSlice.actions
export const campaignReducer = campaignSlice.reducer
