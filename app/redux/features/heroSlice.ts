import { initialHeroConfig } from "@/app/lib/initial-states/hero";
import { IHero } from "@/types/entities/hero";
import { Reducer, createSlice } from "@reduxjs/toolkit";

export interface HeroStatePayload {
  hero: IHero;
  heroes: IHero[];
}

const initialHeroState: HeroStatePayload = {
  hero: initialHeroConfig,
  heroes: [],
};

export const heroSlice = createSlice({
  name: "hero",
  initialState: initialHeroState,
  reducers: {
    addHeroToState: (state, { payload }) => {
      state.heroes.push(payload);
    },
    deleteHeroFromState: (state, { payload }) => {
      state.heroes = state.heroes.filter((p) => p.id !== payload);
    },
    hydrateHero: (state, { payload }) => {
      state.hero = payload;
    },
    hydrateHeroes: (state, { payload }) => {
      state.heroes = payload;
    },
    updateHeroInState: (state, { payload }) => {
      const index = state.heroes.findIndex((p) => p.id === payload.id);
      if (index !== -1) {
        state.heroes[index] = { ...state.heroes[index], ...payload.data };
      }
    },
  },
});

export const heroReducer = heroSlice.reducer as Reducer<HeroStatePayload>;

export const {
  addHeroToState,
  deleteHeroFromState,
  hydrateHero,
  hydrateHeroes,
  updateHeroInState,
} = heroSlice.actions;
