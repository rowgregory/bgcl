import { IHeroStudioEditor } from "@/types/common";
import { IHero } from "@/types/entities/hero";
import React, { FC } from "react";

const CtaEditor: FC<IHeroStudioEditor> = ({ activeHero, updateActiveHero }) => {
  return (
    <div className="border-b border-neutral-800 bg-neutral-900/50 p-4">
      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
        Call to Action
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs text-neutral-400 mb-2">
            Button Text
          </label>
          <input
            type="text"
            value={activeHero.ctaText}
            onChange={(e) => updateActiveHero({ ctaText: e.target.value })}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-2">
            BG Color
          </label>
          <input
            type="color"
            value={activeHero.ctaBackgroundColor}
            onChange={(e) =>
              updateActiveHero({
                ctaBackgroundColor: e.target.value,
              })
            }
            className="w-full h-9 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-2">
            Text Color
          </label>
          <input
            type="color"
            value={activeHero.ctaTextColor}
            onChange={(e) =>
              updateActiveHero({
                ctaTextColor: e.target.value,
              })
            }
            className="w-full h-9 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>
      {/* Border Radius */}
      <div>
        <label className="block text-xs text-neutral-400 mb-2">
          Border Radius: {activeHero.ctaBorderRadius}px
        </label>
        <input
          type="range"
          min="0"
          max="50"
          step="1"
          value={activeHero.ctaBorderRadius}
          onChange={(e) =>
            updateActiveHero({
              ctaBorderRadius: e.target.value,
            })
          }
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
          <span>Square</span>
          <span>Rounded</span>
          <span>Pill</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-neutral-400 mb-2">
            Link Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateActiveHero({ ctaLink: "/" })}
              className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                !activeHero.ctaLink.startsWith("http")
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              Internal
            </button>
            <button
              onClick={() => updateActiveHero({ ctaLink: "https://" })}
              className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                activeHero.ctaLink.startsWith("http")
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              External
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-2">
            Animation
          </label>
          <select
            value={activeHero.ctaAnimation}
            onChange={(e) =>
              updateActiveHero({
                ctaAnimation: e.target.value as IHero["ctaAnimation"],
              })
            }
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="fade-up">Fade Up</option>
            <option value="fade-down">Fade Down</option>
            <option value="fade-left">Fade Left</option>
            <option value="fade-right">Fade Right</option>
            <option value="scale">Scale</option>
            <option value="bounce">Bounce</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <input
        type="text"
        value={activeHero.ctaLink}
        onChange={(e) => updateActiveHero({ ctaLink: e.target.value })}
        placeholder={
          activeHero.ctaLink.startsWith("http") ? "https://sqysh.io" : "/about"
        }
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
};

export default CtaEditor;
