import { LucideIcon } from "lucide-react";
import React, { FC } from "react";

const CoreFeature: FC<{
  index: number;
  feature: {
    icon: LucideIcon;
    title: string;
    description: string;
    hours: string;
    cost: string;
  };
}> = ({ index, feature }) => {
  return (
    <div
      key={index}
      className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-violet-600/20 rounded-lg border border-violet-500/30 flex-shrink-0">
          <feature.icon className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm mb-1">
            {feature.title}
          </h3>
          <p className="text-neutral-300 text-xs mb-2 leading-relaxed">
            {feature.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-400">{feature.hours}</span>
            <span className="font-semibold text-emerald-400 text-sm">
              {feature.cost}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreFeature;
