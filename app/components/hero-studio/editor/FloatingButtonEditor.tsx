import { IHeroStudioEditor } from "@/types/common";
import { IHero } from "@/types/entities/hero";
import React, { FC } from "react";

const FloatingButtonEditor: FC<IHeroStudioEditor> = ({
  activeHero,
  updateActiveHero,
}) => {
  return (
    <div className="border-b border-neutral-800 bg-neutral-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
          Floating Button
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={activeHero.showFloatingButton}
            onChange={(e) =>
              updateActiveHero({
                showFloatingButton: e.target.checked,
              })
            }
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {activeHero.showFloatingButton && (
        <div className="space-y-3">
          {/* Button Text */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={activeHero.floatingButtonText}
              onChange={(e) =>
                updateActiveHero({
                  floatingButtonText: e.target.value,
                })
              }
              placeholder="Get Help"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">
              Position
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "top-left", label: "Top Left" },
                { value: "top-right", label: "Top Right" },
                {
                  value: "bottom-left",
                  label: "Bottom Left",
                },
                {
                  value: "bottom-right",
                  label: "Bottom Right",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateActiveHero({
                      floatingButtonPosition:
                        option.value as IHero["floatingButtonPosition"],
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                    activeHero.floatingButtonPosition === option.value
                      ? "bg-indigo-600 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-2">
                Background
              </label>
              <input
                type="color"
                value={activeHero.floatingButtonBgColor}
                onChange={(e) =>
                  updateActiveHero({
                    floatingButtonBgColor: e.target.value,
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
                value={activeHero.floatingButtonTextColor}
                onChange={(e) =>
                  updateActiveHero({
                    floatingButtonTextColor: e.target.value,
                  })
                }
                className="w-full h-9 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">
              Border Radius: {activeHero.floatingButtonBorderRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={activeHero.floatingButtonBorderRadius}
              onChange={(e) =>
                updateActiveHero({
                  floatingButtonBorderRadius: e.target.value,
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

          {/* Animation */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">
              Animation
            </label>
            <select
              value={activeHero.floatingButtonAnimation}
              onChange={(e) =>
                updateActiveHero({
                  floatingButtonAnimation: e.target
                    .value as IHero["floatingButtonAnimation"],
                })
              }
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="pulse">Pulse</option>
              <option value="bounce">Bounce</option>
              <option value="shake">Shake</option>
              <option value="none">None</option>
            </select>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">Icon</label>
            <select
              value={activeHero.floatingButtonIcon}
              onChange={(e) =>
                updateActiveHero({
                  floatingButtonIcon: e.target
                    .value as IHero["floatingButtonIcon"],
                })
              }
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="none">No Icon</option>
              <option value="chat">Chat</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="arrow">Arrow</option>
              <option value="info">Info</option>
              <option value="help">Help</option>
            </select>
          </div>

          {/* Action Type */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">
              Action
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {[
                { value: "internal", label: "Internal Link" },
                { value: "external", label: "External Link" },
                { value: "modal", label: "Open Modal" },
                { value: "drawer", label: "Open Drawer" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    const updates: Partial<IHero> = {
                      floatingButtonAction:
                        option.value as IHero["floatingButtonAction"],
                    };

                    // Auto-set appropriate link based on type
                    if (option.value === "internal") {
                      updates.floatingButtonLink = "/contact";
                    } else if (option.value === "external") {
                      updates.floatingButtonLink = "https://sqysh.io";
                    }

                    updateActiveHero(updates);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                    activeHero.floatingButtonAction === option.value
                      ? "bg-indigo-600 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Link input (only for internal/external) */}
            {(activeHero.floatingButtonAction === "internal" ||
              activeHero.floatingButtonAction === "external") && (
              <input
                type="text"
                value={activeHero.floatingButtonLink}
                onChange={(e) =>
                  updateActiveHero({
                    floatingButtonLink: e.target.value,
                  })
                }
                placeholder={
                  activeHero.floatingButtonAction === "internal"
                    ? "/contact"
                    : "https://sqysh.io"
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

export default FloatingButtonEditor;
