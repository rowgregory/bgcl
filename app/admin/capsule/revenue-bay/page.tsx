import CapsuleVsHarness from "@/app/components/admin/CapsuleVsHarness";
import React from "react";

const RevenueBay = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-66px)]">
        {/* Main Content Area */}
        <div className="flex-1 p-6 md:overflow-y-auto text-white text-sm">
          <CapsuleVsHarness />
        </div>
      </div>
    </div>
  );
};

export default RevenueBay;
