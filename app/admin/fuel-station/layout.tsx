"use client";

import SubNavLink from "@/app/components/SubNavLink";
import { glossyLowbitObscureBleep } from "@/app/lib/constants/sound-effects";
import useCustomPathname from "@/hooks/useCustomPathname";
import useSoundEffect from "@/hooks/useSoundEffect";
import React, { FC, ReactNode } from "react";

const theFuelStationNavLinks = (path: string) => [
  {
    textKey: "Energy Hub",
    linkKey: "/admin/fuel-station/energy-hub",
    isActive: path === "/admin/fuel-station/energy-hub",
  },
  {
    textKey: "Donor Bay",
    linkKey: "/admin/fuel-station/donor-bay",
    isActive: path === "/admin/fuel-station/donor-bay",
  },
  {
    textKey: "Campaigns",
    linkKey: "/admin/fuel-station/campaigns",
    isActive: path === "/admin/fuel-station/campaigns",
  },
  {
    textKey: "Transactions",
    linkKey: "/admin/fuel-station/transactions",
    isActive: path === "/admin/fuel-station/transactions",
  },
  {
    textKey: "Analytics",
    linkKey: "/admin/fuel-station/analytics",
    isActive: path === "/admin/fuel-station/analytics",
  },
];

const TheFuelStationLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const path = useCustomPathname();
  const { play } = useSoundEffect(glossyLowbitObscureBleep, true);

  return (
    <>
      {/* Navigation */}
      <div className="fixed w-full z-10 bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-700/30">
        <div className="px-2 xs:px-3 sm:px-6">
          <nav className="flex items-center py-2 xs:py-3 sm:py-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-6 lg:space-x-8 min-w-max">
              {theFuelStationNavLinks(path).map((item) => (
                <SubNavLink
                  key={item.linkKey}
                  handleNav={() => play()}
                  item={item}
                />
              ))}
            </div>
          </nav>
        </div>
      </div>
      <main className="pt-[68px]">{children}</main>
    </>
  );
};

export default TheFuelStationLayout;
