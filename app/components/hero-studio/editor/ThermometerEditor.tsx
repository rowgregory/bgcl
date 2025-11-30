import { IHeroStudioEditor } from "@/types/common";
import React, { FC } from "react";

const ThermometerEditor: FC<IHeroStudioEditor> = ({
  activeHero,
  updateActiveHero,
}) => {
  return (
    <div className="border-b border-neutral-800 bg-neutral-900/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
          Campaign Thermometer
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={activeHero.showThermometer || false}
            onChange={(e) => {
              const isChecked = e.target.checked;
              updateActiveHero({
                showThermometer: isChecked,
                // If enabling thermometer, disable countdown
                showCountdown: isChecked ? false : activeHero.showCountdown,
              });
            }}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {activeHero.showThermometer && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {["left", "center", "right"].map((pos) => (
              <button
                key={pos}
                onClick={() =>
                  updateActiveHero({
                    thermometerPosition: pos as "left" | "center" | "right",
                  })
                }
                className={`px-3 py-1.5 rounded-md text-xs capitalize transition-all ${
                  activeHero.thermometerPosition === pos
                    ? "bg-indigo-600 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-2">
                Goal
              </label>
              <input
                type="number"
                value={activeHero.thermometerGoal}
                onChange={(e) =>
                  updateActiveHero({
                    thermometerGoal: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-2">
                Current
              </label>
              <input
                type="number"
                value={activeHero.thermometerCurrent || 0}
                onChange={(e) =>
                  updateActiveHero({
                    thermometerCurrent: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-2">
                Color
              </label>
              <input
                type="color"
                value={activeHero.thermometerColor}
                onChange={(e) =>
                  updateActiveHero({
                    thermometerColor: e.target.value,
                  })
                }
                className="w-full h-9 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThermometerEditor;
