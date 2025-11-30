import React, { FC, useState } from "react";
import HeroPreview from "./HeroPreview";
import { IHero } from "@/types/entities/hero";

interface IFullScreenPreviewMode {
  activeHero: IHero;
  setPreviewMode: (previewMode: boolean) => void;
}

const FullScreenPreviewMode: FC<IFullScreenPreviewMode> = ({
  activeHero,
  setPreviewMode,
}) => {
  const [viewportSize, setViewportSize] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  return (
    <div className="flex-1 bg-[#16161f] flex flex-col">
      {/* Preview Mode Top Bar with Viewport Buttons */}
      <div className="bg-[#0f0f14] border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 h-[38px]">
          <h2 className="text-white font-semibold">{activeHero.name}</h2>

          {/* Viewport Size Selector - ONLY IN PREVIEW MODE */}
          <div className="flex items-center gap-2 ml-8">
            <span className="text-xs text-neutral-500">Viewport:</span>
            <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-1">
              <button
                onClick={() => setViewportSize("mobile")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  viewportSize === "mobile"
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
                title="Mobile (375px)"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Mobile
              </button>

              <button
                onClick={() => setViewportSize("tablet")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  viewportSize === "tablet"
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
                title="Tablet (768px)"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Tablet
              </button>

              <button
                onClick={() => setViewportSize("desktop")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  viewportSize === "desktop"
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
                title="Desktop (1440px)"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Desktop
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setPreviewMode(false)}
          className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Editor
        </button>
      </div>

      {/* Preview Content with Viewport Simulation */}
      <div className="flex-1 flex items-center justify-center p-0.5 overflow-auto">
        <div className="flex flex-col items-center justify-center w-full">
          {/* Viewport Container */}
          <div
            className={`border-2 rounded-xl overflow-hidden shadow-2xl bg-white transition-all duration-300 ${
              viewportSize === "mobile"
                ? "w-[375px] h-[667px] border-neutral-700"
                : viewportSize === "tablet"
                  ? "w-3xl h-[1024px] border-neutral-700"
                  : "w-full h-[calc(100vh-75px)] border-neutral-800"
            }`}
            style={{
              transform: viewportSize === "tablet" ? "scale(0.65)" : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            <div className="w-full h-full overflow-auto">
              <HeroPreview
                hero={activeHero}
                disableAnimations={false}
                disableResponsiveScaling={true}
                viewportSize={viewportSize}
                isViewportPreview={true}
              />
            </div>
          </div>

          {/* Dimension Label */}
          <div className="mt-4 text-xs text-neutral-500 font-mono">
            {viewportSize === "mobile" && "375 × 667"}
            {viewportSize === "tablet" && "768 × 1024"}
            {viewportSize === "desktop" && "Responsive (Full Width)"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenPreviewMode;
