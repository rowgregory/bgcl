import { initialHeroConfig } from '@/app/lib/initial-states/hero'
import { IHero } from '@/types/entities/hero'
import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface HeroStatePayload {
  hero: IHero
  heroes: IHero[]
}

const initialHeroState: HeroStatePayload = {
  hero: initialHeroConfig,
  heroes: []
}

export const heroSlice = createSlice({
  name: 'hero',
  initialState: initialHeroState,
  reducers: {
    hydrateHero: (state, { payload }) => {
      state.hero = payload
    },
    hydrateHeroes: (state, { payload }) => {
      state.heroes = payload
    }
  }
})

export const heroReducer = heroSlice.reducer as Reducer<HeroStatePayload>

export const { hydrateHero, hydrateHeroes } = heroSlice.actions
