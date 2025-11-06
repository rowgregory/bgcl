import { ReactNode } from "react";
import { IUser } from "./entities";

export interface ILayoutClient {
  data: { users: IUser[] | null; user: IUser | null };
  children: ReactNode;
}
