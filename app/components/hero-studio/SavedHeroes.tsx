import { IHero } from "@/types/entities/hero";
import { Eye, Layers, Plus, Trash2, X } from "lucide-react";
import React, { FC } from "react";

interface ISavedHeros {
  deleteHero: (id: string) => void;
  heroes: IHero[] | null;
  onClose: () => void;
  createNewHero: () => void;
  setActiveHero: (hero: IHero) => void;
  activeHero: IHero | null;
  setPreviewMode: (previewMode: boolean) => void;
  previewMode: boolean;
}

const SavedHeroes: FC<ISavedHeros> = ({
  deleteHero,
  heroes,
  onClose,
  createNewHero,
  setActiveHero,
  activeHero,
  setPreviewMode,
  previewMode,
}) => {
  return (
    <div className="w-72 bg-[#1a1a24] border-r border-neutral-800 flex flex-col">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-sm">Saved Heroes</h2>
          <p className="text-neutral-500 text-xs mt-0.5">
            {(heroes ?? []).length}{" "}
            {(heroes ?? []).length === 1 ? "hero" : "heroes"} created
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      <div className="p-3 border-b border-neutral-800">
        <button
          onClick={createNewHero}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Hero
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {(heroes ?? []).length === 0 ? (
          <div className="text-center py-12 px-4">
            <Layers className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No heroes yet</p>
            <p className="text-neutral-600 text-xs mt-1">
              Create your first hero to get started
            </p>
          </div>
        ) : (
          (heroes ?? []).map((hero: IHero) => (
            <div
              key={hero.id}
              onClick={() => setActiveHero(hero)}
              className={`group p-3 rounded-lg cursor-pointer transition-all border ${
                activeHero?.id === hero.id
                  ? "bg-indigo-500/10 border-indigo-500"
                  : "bg-[#22222e] border-neutral-700 hover:border-neutral-600"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm truncate">
                    {hero.name}
                  </h4>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {hero.title}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHero(hero.id);
                  }}
                  className="p-1 hover:bg-red-500/10 rounded text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="capitalize">{hero.backgroundType}</span>
                <span>•</span>
                <span className="capitalize">{hero.minHeight}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-neutral-800 space-y-2">
        <button
          onClick={() => setPreviewMode(!previewMode)}
          disabled={!activeHero}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eye className="w-4 h-4" />
          {previewMode ? "Edit Mode" : "Preview"}
        </button>
      </div>
    </div>
  );
};

export default SavedHeroes;
