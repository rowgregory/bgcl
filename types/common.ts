import { ReactNode } from "react";
import { IHero } from "./entities/hero";
import { IUser } from "./entities/user";

export interface ILayoutClient {
  data: { users: IUser[] | null; user: IUser | null };
  children: ReactNode;
}

export interface IHeroStudioEditor {
  activeHero: IHero;
  updateActiveHero: (updates: Partial<IHero>) => void;
}

export interface RouteParams {
  id: string;
}

export interface ILayout {
  children: ReactNode;
}
