import { Layers } from "lucide-react";
import React, { FC } from "react";

interface IEmptyHero {
  createNewHero: () => void;
}

const EmptyHero: FC<IEmptyHero> = ({ createNewHero }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#16161f]">
      <div className="text-center">
        <Layers className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">
          No Hero Selected
        </h3>
        <p className="text-neutral-500 text-sm mb-6">
          Select a hero from the sidebar or create a new one
        </p>
        <button
          onClick={createNewHero}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Create Your First Hero
        </button>
      </div>
    </div>
  );
};

export default EmptyHero;
