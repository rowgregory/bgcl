import { IHeroStudioEditor } from "@/types/common";
import React, { FC } from "react";

const LayoutEditor: FC<IHeroStudioEditor> = ({
  activeHero,
  updateActiveHero,
}) => {
  return (
    <div className="border-b border-neutral-800 bg-neutral-900/50 p-4">
      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
        Content Layout
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => updateActiveHero({ layout: "side-by-side" })}
          className={`p-3 rounded-lg border transition-all ${
            activeHero.layout === "side-by-side"
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700"
          }`}
        >
          <div className="flex gap-1 mb-2 justify-center">
            <div className="w-3 h-8 bg-current opacity-50 rounded"></div>
            <div className="w-3 h-8 bg-current opacity-50 rounded"></div>
          </div>
          <p className="text-xs text-center">Side by Side</p>
        </button>

        <button
          onClick={() => updateActiveHero({ layout: "stacked-center" })}
          className={`p-3 rounded-lg border transition-all ${
            activeHero.layout === "stacked-center"
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700"
          }`}
        >
          <div className="flex flex-col gap-1 mb-2 items-center">
            <div className="w-8 h-2 bg-current opacity-50 rounded"></div>
            <div className="w-8 h-2 bg-current opacity-50 rounded"></div>
          </div>
          <p className="text-xs text-center">Stacked Center</p>
        </button>

        <button
          onClick={() => updateActiveHero({ layout: "stacked-left" })}
          className={`p-3 rounded-lg border transition-all ${
            activeHero.layout === "stacked-left"
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700"
          }`}
        >
          <div className="flex flex-col gap-1 mb-2 items-start">
            <div className="w-8 h-2 bg-current opacity-50 rounded"></div>
            <div className="w-8 h-2 bg-current opacity-50 rounded"></div>
          </div>
          <p className="text-xs text-center">Stacked Left</p>
        </button>

        <button
          onClick={() => updateActiveHero({ layout: "stacked-right" })}
          className={`p-3 rounded-lg border transition-all ${
            activeHero.layout === "stacked-right"
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700"
          }`}
        >
          <div className="flex flex-col gap-1 mb-2 items-end">
            <div className="w-8 h-2 bg-current opacity-50 rounded"></div>
            <div className="w-8 h-2 bg-current opacity-50 rounded"></div>
          </div>
          <p className="text-xs text-center">Stacked Right</p>
        </button>
      </div>
      <p className="text-xs text-neutral-500 mt-3">
        {activeHero.layout === "side-by-side" &&
          "Content and widget displayed side by side"}
        {activeHero.layout === "stacked-center" &&
          "Content and widget stacked vertically, centered"}
        {activeHero.layout === "stacked-left" &&
          "Content and widget stacked vertically, aligned left"}
        {activeHero.layout === "stacked-right" &&
          "Content and widget stacked vertically, aligned right"}
      </p>
    </div>
  );
};

export default LayoutEditor;
