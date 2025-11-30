import React, { FC } from "react";
import ActionMenuDropdown from "./ActionMenuDropdown";
import { IFixedHeader } from "@/types/navigation";
import ActionMenuButton from "../buttons/ActionMenuButton";
import MobileMenuButton from "../buttons/MobileMenuButton";
import LogoutButton from "../buttons/LogoutButton";

const FixedHeader: FC<IFixedHeader> = ({
  isNavigationCollapsed,
  selectedPage,
  links,
  actionItems,
}) => {
  const getPageDisplayName = (page: string, isDescription?: boolean) => {
    const item = links?.find((nav: { label: string }) => nav.label === page);

    return isDescription ? item?.description : page;
  };

  return (
    <>
      <ActionMenuDropdown actionItems={actionItems} />
      <header
        className={`${isNavigationCollapsed ? "lg:ml-20" : "lg:ml-[280px]"} fixed left-0 top-0 right-0 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 z-30 h-[69px]`}
        style={{
          transition: "left 0.3s ease-in-out",
        }}
      >
        <div className="h-full px-6 flex items-center justify-between">
          {/* Header Left */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold bg-linear-to-r from-indigo-500 via-violet-500 to-violet-500 bg-clip-text text-transparent">
                {getPageDisplayName(selectedPage)}
              </h1>
              <p className="text-neutral-400 text-sm hidden lg:block">
                {selectedPage === "Mission Control"
                  ? "Overview of operations, analytics, and system status"
                  : `Currently viewing: ${getPageDisplayName(selectedPage, true)}`}
              </p>
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center space-x-4">
            <ActionMenuButton />
            <MobileMenuButton />
            <LogoutButton />
          </div>
        </div>
      </header>
    </>
  );
};

export default FixedHeader;
