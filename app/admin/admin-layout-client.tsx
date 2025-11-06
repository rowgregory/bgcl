"use client";

import React, { FC, useEffect, useState } from "react";
import FixedLeftNavigationPanel from "../components/FixedLeftNavigationPanel";
import useCustomPathname from "@/hooks/useCustomPathname";
// import { useSession } from "next-auth/react";
import getCurrentPageId from "../lib/common/getCurrentPageId";
// import { useAppDispatch } from "../redux/store";
import { motion } from "framer-motion";
// import { setHydrateUsers, setUser } from "../redux/features/userSlice";
import { adminNavLinks } from "../lib/navigation/adminNavLinks";
import adminActionItems from "../lib/navigation/adminActionItems";
import FixedHeader from "../components/FixedHeader";
import { ILayoutClient } from "@/types/common";

const AdminLayoutClient: FC<ILayoutClient> = ({ data, children }) => {
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const path = useCustomPathname();
  //   const session = useSession();
  const selectedPage = getCurrentPageId(path, adminNavLinks);
  // const dispatch = useAppDispatch();

  //   useEffect(() => {
  //     if (data) {
  //       dispatch(setHydrateUsers(data?.users));
  //       dispatch(setUser(data?.user));
  //     }
  //   }, [dispatch, data]);

  useEffect(() => {
    if (selectedPage) {
      console.log("selected page: ", selectedPage);
    } else {
      console.log("ADMIN LAYOUT CLIENT: ", data);
    }
  }, [selectedPage, data]);

  const session = null;

  return (
    <>
      {/* <MobileNavigationDrawer links={adminNavLinks} /> */}
      <div className="min-h-screen bg-neutral-950 flex">
        <FixedLeftNavigationPanel
          isNavigationCollapsed={isNavigationCollapsed}
          setIsNavigationCollapsed={setIsNavigationCollapsed}
          selectedPage={selectedPage}
          links={adminNavLinks}
          data={session}
        />

        {/* Main Content Area */}
        <div
          className={`${isNavigationCollapsed ? "lg:ml-20" : "lg:ml-[280px]"} flex-1 flex flex-col`}
        >
          {/* Fixed Header */}
          <FixedHeader
            isNavigationCollapsed={isNavigationCollapsed}
            selectedPage={selectedPage}
            links={adminNavLinks}
            actionItems={adminActionItems}
          />

          <main className="flex-1 pt-[68px] overflow-hidden">
            <motion.div
              key={selectedPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-y-auto"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayoutClient;
