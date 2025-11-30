import { IHero } from "@/types/entities/hero";
import { ImageIcon, Trash2 } from "lucide-react";
import React, { ChangeEvent, FC } from "react";
import Picture from "../../common/Picture";
import { IHeroStudioEditor } from "@/types/common";

const BackgroundEditor: FC<IHeroStudioEditor> = ({
  activeHero,
  updateActiveHero,
}) => {
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateActiveHero({
        backgroundFile: file,
        backgroundImage: URL.createObjectURL(file),
      });
    }
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateActiveHero({
        backgroundVideoFile: file,
        backgroundVideo: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="border-b border-neutral-800 bg-neutral-900/50 p-4">
      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
        Background
      </h3>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {["color", "gradient", "image", "video"].map((type) => (
          <button
            key={type}
            onClick={() =>
              updateActiveHero({
                backgroundType: type as
                  | "color"
                  | "gradient"
                  | "image"
                  | "video",
              })
            }
            className={`px-3 py-2 rounded-md text-xs font-medium capitalize transition-all ${
              activeHero.backgroundType === type
                ? "bg-indigo-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {activeHero.backgroundType === "color" && (
        <input
          type="color"
          value={activeHero.backgroundColor}
          onChange={(e) =>
            updateActiveHero({
              backgroundColor: e.target.value,
            })
          }
          className="w-full h-10 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
        />
      )}

      {activeHero.backgroundType === "gradient" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-neutral-400 mb-2">From</label>
            <input
              type="color"
              value={activeHero.gradientFrom}
              onChange={(e) =>
                updateActiveHero({
                  gradientFrom: e.target.value,
                })
              }
              className="w-full h-10 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-2">To</label>
            <input
              type="color"
              value={activeHero.gradientTo}
              onChange={(e) =>
                updateActiveHero({
                  gradientTo: e.target.value,
                })
              }
              className="w-full h-10 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {activeHero.backgroundType === "image" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="border border-dashed border-neutral-700 rounded-lg p-4 text-center hover:border-neutral-600 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <ImageIcon className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                  <p className="text-xs text-neutral-400">Upload Image</p>
                </label>
              </div>
              <input
                type="text"
                value={
                  activeHero.backgroundFile ? "" : activeHero.backgroundImage
                }
                onChange={(e) =>
                  updateActiveHero({
                    backgroundImage: e.target.value,
                    backgroundFile: null,
                  })
                }
                placeholder="Or paste URL"
                disabled={!!activeHero.backgroundFile}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs mt-2 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Size
                </label>
                <select
                  value={activeHero.backgroundSize}
                  onChange={(e) =>
                    updateActiveHero({
                      backgroundSize: e.target.value as
                        | "cover"
                        | "contain"
                        | "auto",
                    })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="auto">Original</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Position
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { value: "top-left", label: "↖" },
                    { value: "top", label: "↑" },
                    { value: "top-right", label: "↗" },
                    { value: "left", label: "←" },
                    { value: "center", label: "●" },
                    { value: "right", label: "→" },
                    { value: "bottom-left", label: "↙" },
                    { value: "bottom", label: "↓" },
                    { value: "bottom-right", label: "↘" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateActiveHero({
                          backgroundPosition:
                            option.value as IHero["backgroundPosition"],
                        })
                      }
                      className={`px-2 py-1 rounded text-sm ${
                        activeHero.backgroundPosition === option.value
                          ? "bg-indigo-600 text-white"
                          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Overlay: {Math.round(activeHero.overlayOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={activeHero.overlayOpacity}
                  onChange={(e) =>
                    updateActiveHero({
                      overlayOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {activeHero.backgroundImage && (
            <div className="relative rounded-lg overflow-hidden border border-neutral-700">
              <Picture
                priority={true}
                src={activeHero.backgroundImage}
                alt="Background"
                className="w-full h-24 object-cover"
              />
              <button
                onClick={() =>
                  updateActiveHero({
                    backgroundImage: "",
                    backgroundFile: null,
                  })
                }
                className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded text-white"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {activeHero.backgroundType === "video" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="border border-dashed border-neutral-700 rounded-lg p-4 text-center hover:border-neutral-600 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer block">
                  <ImageIcon className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                  <p className="text-xs text-neutral-400">Upload Video</p>
                </label>
              </div>
              <input
                type="text"
                value={
                  activeHero.backgroundVideoFile
                    ? ""
                    : activeHero.backgroundVideo
                }
                onChange={(e) =>
                  updateActiveHero({
                    backgroundVideo: e.target.value,
                    backgroundVideoFile: null,
                  })
                }
                placeholder="Or paste URL"
                disabled={!!activeHero.backgroundVideoFile}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs mt-2 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Size
                </label>
                <select
                  value={activeHero.backgroundSize}
                  onChange={(e) =>
                    updateActiveHero({
                      backgroundSize: e.target.value as
                        | "cover"
                        | "contain"
                        | "auto",
                    })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="auto">Original</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Position
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { value: "top-left", label: "↖" },
                    { value: "top", label: "↑" },
                    { value: "top-right", label: "↗" },
                    { value: "left", label: "←" },
                    { value: "center", label: "●" },
                    { value: "right", label: "→" },
                    { value: "bottom-left", label: "↙" },
                    { value: "bottom", label: "↓" },
                    { value: "bottom-right", label: "↘" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateActiveHero({
                          backgroundPosition:
                            option.value as IHero["backgroundPosition"],
                        })
                      }
                      className={`px-2 py-1 rounded text-sm ${
                        activeHero.backgroundPosition === option.value
                          ? "bg-indigo-600 text-white"
                          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Overlay: {Math.round(activeHero.overlayOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={activeHero.overlayOpacity}
                  onChange={(e) =>
                    updateActiveHero({
                      overlayOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {activeHero.backgroundVideo && (
            <div className="relative rounded-lg overflow-hidden border border-neutral-700">
              <video
                src={activeHero.backgroundVideo}
                className="w-full h-24 object-cover"
                muted
                loop
                autoPlay
              />
              <button
                onClick={() =>
                  updateActiveHero({
                    backgroundVideo: "",
                    backgroundVideoFile: null,
                  })
                }
                className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded text-white"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundEditor;
