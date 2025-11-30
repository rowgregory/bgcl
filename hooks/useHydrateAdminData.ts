import { hydrateEvents } from "@/app/redux/features/eventSlice";
import { hydrateHeroes } from "@/app/redux/features/heroSlice";
import { hydrateStats } from "@/app/redux/features/statsSlice";
import { hydrateUsers } from "@/app/redux/features/userSlice";
import { useAppDispatch } from "@/app/redux/store";
import { AdminLayoutData } from "@/types/admin";
import { useEffect } from "react";

export const useHydrateAdminData = (data: AdminLayoutData) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data.users) dispatch(hydrateUsers(data.users));
    if (data.events) dispatch(hydrateEvents(data.events));
    if (data.heroes) dispatch(hydrateHeroes(data.heroes));
    if (data.stats) dispatch(hydrateStats(data.stats));
  }, [dispatch, data]);
};
