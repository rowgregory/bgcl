import { coreFeatures } from "@/app/lib/constants/project-breakdown";
import { Calculator } from "lucide-react";
import React, { FC } from "react";
import CoreFeature from "./CoreFeature";

interface ICoreFeaturesGrid {
  totalCoreFeaturesPrice: number;
  totalCoreFeaturesPriceWithDiscount: number;
}

const CoreFeaturesGrid: FC<ICoreFeaturesGrid> = ({
  totalCoreFeaturesPrice,
  totalCoreFeaturesPriceWithDiscount,
}) => {
  return (
    <section className="mb-12">
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-neutral-800 rounded-lg">
            <Calculator className="w-6 h-6 text-neutral-300" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-100">
            Required Core Features
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {coreFeatures.map((feature, index) => (
            <CoreFeature key={index} feature={feature} />
          ))}
        </div>

        <div className="mt-6 bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-100">
                Core Features Total
              </h3>
              <p className="text-neutral-400 text-sm">
                {coreFeatures.length} deliverables
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-400 line-through mb-1">
                ${totalCoreFeaturesPrice.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 justify-end">
                <div className="text-2xl font-bold text-indigo-400">
                  ${totalCoreFeaturesPriceWithDiscount.toLocaleString()}
                </div>
                <span className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  15% OFF
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesGrid;
