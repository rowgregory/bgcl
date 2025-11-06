"use client";

import SubNavLink from "@/app/components/SubNavLink";
import { glossyLowbitObscureBleep } from "@/app/lib/constants/sound-effects";
import useCustomPathname from "@/hooks/useCustomPathname";
import useSoundEffect from "@/hooks/useSoundEffect";
import React, { FC, ReactNode } from "react";

const theCapsuleNavLinks = (path: string) => [
  {
    textKey: "The Core",
    linkKey: "/admin/capsule/core",
    isActive: path === "/admin/capsule/core",
  },
  {
    textKey: "Manifest",
    linkKey: "/admin/capsule/manifest",
    isActive: path === "/admin/capsule/manifest",
  },
  {
    textKey: "Revenue Bay",
    linkKey: "/admin/capsule/revenue-bay",
    isActive: path === "/admin/capsule/revenue-bay",
  },
  {
    textKey: "Gate Control",
    linkKey: "/admin/capsule/gate-control",
    isActive: path === "/admin/capsule/gate-control",
  },
  {
    textKey: "Intel Hub",
    linkKey: "/admin/capsule/intel-hub",
    isActive: path === "/admin/capsule/intel-hub",
  },
];

const TheCapsuleLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const path = useCustomPathname();
  const { play } = useSoundEffect(glossyLowbitObscureBleep, true);

  return (
    <>
      {/* Navigation */}
      <div className="fixed w-full z-10 bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-700/30">
        <div className="px-2 xs:px-3 sm:px-6">
          <nav className="flex items-center py-2 xs:py-3 sm:py-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-6 lg:space-x-8 min-w-max">
              {theCapsuleNavLinks(path).map((item) => (
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

export default TheCapsuleLayout;
