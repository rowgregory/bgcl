import { IHeroStudioEditor } from "@/types/common";
import { IHero } from "@/types/entities/hero";
import React, { FC } from "react";

const HeightEditor: FC<IHeroStudioEditor> = ({
  activeHero,
  updateActiveHero,
}) => {
  return (
    <div className="border-b border-neutral-800 bg-neutral-900/30 p-4">
      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
        Height
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-neutral-400 mb-2">
            Height Preset
          </label>
          <select
            value={activeHero.minHeight}
            onChange={(e) => {
              const newMinHeight = e.target.value as "screen" | "half" | "full";
              const updates: Partial<IHero> = {
                minHeight: newMinHeight,
              };
              if (newMinHeight === "screen") updates.actualHeight = "100vh";
              else if (newMinHeight === "half") updates.actualHeight = "50vh";
              else if (newMinHeight === "full") updates.actualHeight = "60vh";
              updateActiveHero(updates);
            }}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="screen">Full Screen</option>
            <option value="half">Half Screen</option>
            <option value="full">Custom</option>
          </select>
        </div>
        {activeHero.minHeight === "full" && (
          <div>
            <label className="block text-xs text-neutral-400 mb-2">
              Custom Height
            </label>
            <select
              value={activeHero.actualHeight}
              onChange={(e) =>
                updateActiveHero({
                  actualHeight: e.target.value,
                })
              }
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {Array.from({ length: 19 }, (_, i) => (i + 1) * 5).map((vh) => (
                <option key={vh} value={`${vh}vh`}>
                  {vh}vh
                </option>
              ))}
              <option value="100vh">100vh</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeightEditor;
