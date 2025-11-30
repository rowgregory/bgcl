import { IHeroStudioEditor } from "@/types/common";
import React, { FC } from "react";

const TopBannerEditor: FC<IHeroStudioEditor> = ({
  activeHero,
  updateActiveHero,
}) => {
  return (
    <div className="border-b border-neutral-800 bg-neutral-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
          Top Banner
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={activeHero.showTopBanner}
            onChange={(e) =>
              updateActiveHero({ showTopBanner: e.target.checked })
            }
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {activeHero.showTopBanner && (
        <div className="space-y-3">
          {/* Banner Text */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">
              Banner Text
            </label>
            <input
              type="text"
              value={activeHero.topBannerText}
              onChange={(e) =>
                updateActiveHero({ topBannerText: e.target.value })
              }
              placeholder="🎉 Limited Time Offer - Join us today!"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Height Slider */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">
              Height: {activeHero.topBannerHeight}px
            </label>
            <input
              type="range"
              min="30"
              max="100"
              step="5"
              value={activeHero.topBannerHeight}
              onChange={(e) =>
                updateActiveHero({ topBannerHeight: e.target.value })
              }
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>Thin (30px)</span>
              <span>Medium (65px)</span>
              <span>Thick (100px)</span>
            </div>
          </div>

          {/* Font Size Slider */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">
              Font Size: {activeHero.topBannerFontSize}rem
            </label>
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.125"
              value={activeHero.topBannerFontSize}
              onChange={(e) =>
                updateActiveHero({ topBannerFontSize: e.target.value })
              }
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={activeHero.topBannerBgColor}
                onChange={(e) =>
                  updateActiveHero({ topBannerBgColor: e.target.value })
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
                value={activeHero.topBannerTextColor}
                onChange={(e) =>
                  updateActiveHero({ topBannerTextColor: e.target.value })
                }
                className="w-full h-9 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Bold Toggle */}
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activeHero.topBannerBold}
                onChange={(e) =>
                  updateActiveHero({ topBannerBold: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
            <span className="text-xs text-neutral-400">Bold Text</span>
          </div>

          {/* Link Type */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">
              Link Action
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { value: "none", label: "No Link" },
                { value: "internal", label: "Internal" },
                { value: "external", label: "External" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateActiveHero({
                      topBannerLinkType: option.value as
                        | "none"
                        | "internal"
                        | "external",
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                    activeHero.topBannerLinkType === option.value
                      ? "bg-indigo-600 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Link URL Input */}
            {activeHero.topBannerLinkType !== "none" && (
              <input
                type="text"
                value={activeHero.topBannerLink}
                onChange={(e) =>
                  updateActiveHero({ topBannerLink: e.target.value })
                }
                placeholder={
                  activeHero.topBannerLinkType === "internal"
                    ? "/about"
                    : "https://example.com"
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBannerEditor;
