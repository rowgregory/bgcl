import { IAdditionalFeature } from "@/types/project-breakdown";
import { CheckCircle } from "lucide-react";
import React, { FC } from "react";

const AdditionalFeature: FC<IAdditionalFeature> = ({
  feature,
  isSelected,
  toggleFeature,
}) => {
  return (
    <div
      key={feature.id}
      onClick={() => toggleFeature(feature.id)}
      className={`cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-lg p-4 border-2 flex flex-col justify-between ${
        isSelected
          ? "bg-indigo-900/50 border-violet-400 shadow-lg shadow-violet-500/25 scale-[102.5%]"
          : "bg-neutral-900/70 border-neutral-600 hover:border-violet-500/50 hover:bg-neutral-800/70"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        {/* Feature Icon */}
        <div
          className={`p-2 rounded-lg border flex-shrink-0 ${
            isSelected
              ? "bg-violet-600/20 border-violet-500/30"
              : "bg-neutral-800/50 border-neutral-700"
          }`}
        >
          <feature.icon
            className={`w-3.5 h-3.5 ${
              isSelected ? "text-violet-400" : "text-neutral-500"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2
            className={`font-bold ${
              isSelected ? "text-white" : "text-neutral-300"
            }`}
          >
            {feature.system}
          </h2>
          <h3 className={`font-semibold text-xs mb-2 text-white`}>
            {feature.title}
          </h3>
          <p
            className={`text-xs leading-relaxed mb-2 ${
              isSelected ? "text-violet-200" : "text-neutral-400"
            }`}
          >
            {feature.description}
          </p>

          {/* ✅ Render array of strings (feature.details) */}
          {feature.details && feature.details.length > 0 && (
            <ul
              className={`text-xs list-disc list-inside space-y-1 ${
                isSelected ? "text-violet-200/80" : "text-neutral-500"
              }`}
            >
              {feature.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* ✅ Cost and Hours */}
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <span
              className={`text-sm font-bold ${
                isSelected ? "text-violet-300" : "text-neutral-500"
              }`}
            >
              ${feature.cost.toLocaleString()}
            </span>
          </div>
          <span
            className={`text-xs ${
              isSelected ? "text-violet-200" : "text-neutral-500"
            }`}
          >
            {feature.hours}
          </span>
        </div>

        {isSelected && (
          <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalFeature;
