import React, { FC } from "react";
import { IHeroStudioEditor } from "@/types/common";
import { IHero } from "@/types/entities/hero";

const ContentEditor: FC<IHeroStudioEditor> = ({
  activeHero,
  updateActiveHero,
}) => {
  return (
    <div className="border-b border-neutral-800 bg-neutral-900/30 p-4">
      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
        Content
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs text-neutral-400">Title</label>
          <input
            type="text"
            value={activeHero.title}
            onChange={(e) => updateActiveHero({ title: e.target.value })}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          />

          {/* Font Size Control - NEW */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              Font Size: {activeHero.titleFontSize}
            </label>
            <input
              type="range"
              min="2"
              max="8"
              step="0.25"
              value={parseFloat(activeHero.titleFontSize)}
              onChange={(e) =>
                updateActiveHero({ titleFontSize: `${e.target.value}rem` })
              }
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>Small (2rem)</span>
              <span>Medium (5rem)</span>
              <span>Large (8rem)</span>
            </div>
          </div>

          {/* Line Height Control */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              Line Height
            </label>
            <input
              type="range"
              min="0.8"
              max="2"
              step="0.1"
              value={activeHero.titleLineHeight || ""}
              onChange={(e) =>
                updateActiveHero({
                  titleLineHeight: e.target.value,
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>Tight</span>
              <span>Normal</span>
              <span>Loose</span>
            </div>
          </div>

          {/* Regular Title Color (only show when gradient is off) */}
          {!activeHero.titleUseGradient && (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="color"
                value={activeHero.titleColor}
                onChange={(e) =>
                  updateActiveHero({ titleColor: e.target.value })
                }
                className="w-full h-8 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
              />
              <select
                value={activeHero.titleAnimation}
                onChange={(e) =>
                  updateActiveHero({
                    titleAnimation: e.target.value as IHero["titleAnimation"],
                  })
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="fade-up">Fade Up</option>
                <option value="fade-down">Fade Down</option>
                <option value="fade-left">Fade Left</option>
                <option value="fade-right">Fade Right</option>
                <option value="scale">Scale</option>
                <option value="none">None</option>
              </select>
            </div>
          )}

          {/* Title Gradient Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activeHero.titleUseGradient}
                onChange={(e) =>
                  updateActiveHero({ titleUseGradient: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
            <span className="text-xs text-neutral-400">
              Use gradient on word
            </span>
          </div>

          {/* Gradient Word Configuration */}
          {activeHero.titleUseGradient && (
            <div className="space-y-2 pt-2 pl-4 border-l-2 border-indigo-500/30">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Word to gradient
                </label>
                <input
                  type="text"
                  value={activeHero.titleGradientWord}
                  onChange={(e) =>
                    updateActiveHero({ titleGradientWord: e.target.value })
                  }
                  placeholder="e.g., Mission"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Enter a word from your title
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    Start
                  </label>
                  <input
                    type="color"
                    value={activeHero.titleGradientFrom}
                    onChange={(e) =>
                      updateActiveHero({ titleGradientFrom: e.target.value })
                    }
                    className="w-full h-9 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    End
                  </label>
                  <input
                    type="color"
                    value={activeHero.titleGradientTo}
                    onChange={(e) =>
                      updateActiveHero({ titleGradientTo: e.target.value })
                    }
                    className="w-full h-9 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Gradient Preview */}
              <div className="bg-neutral-900 rounded-lg p-3 mt-2">
                <p className="text-xs text-neutral-500 mb-2">Preview:</p>
                <span
                  className="text-2xl font-bold"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${activeHero.titleGradientFrom}, ${activeHero.titleGradientTo})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {activeHero.titleGradientWord || "Word"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-neutral-400">Subtitle</label>
          <input
            type="text"
            value={activeHero.subtitle || ""}
            onChange={(e) => updateActiveHero({ subtitle: e.target.value })}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          />

          {/* Font Size Control - NEW */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              Font Size: {activeHero.subtitleFontSize}
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.125"
              value={parseFloat(activeHero.subtitleFontSize)}
              onChange={(e) =>
                updateActiveHero({ subtitleFontSize: `${e.target.value}rem` })
              }
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>Small (1rem)</span>
              <span>Medium (2rem)</span>
              <span>Large (3rem)</span>
            </div>
          </div>

          {/* Line Height Control */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              Line Height
            </label>
            <input
              type="range"
              min="0.8"
              max="2"
              step="0.1"
              value={activeHero.subtitleLineHeight || ""}
              onChange={(e) =>
                updateActiveHero({
                  subtitleLineHeight: e.target.value,
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>Tight</span>
              <span>Normal</span>
              <span>Loose</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="color"
              value={activeHero.subtitleColor}
              onChange={(e) =>
                updateActiveHero({
                  subtitleColor: e.target.value,
                })
              }
              className="w-full h-8 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
            />
            <select
              value={activeHero.subtitleAnimation}
              onChange={(e) =>
                updateActiveHero({
                  subtitleAnimation: e.target
                    .value as IHero["subtitleAnimation"],
                })
              }
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="fade-up">Fade Up</option>
              <option value="fade-down">Fade Down</option>
              <option value="fade-left">Fade Left</option>
              <option value="fade-right">Fade Right</option>
              <option value="scale">Scale</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
