import { Gamepad2, RotateCcw, ShoppingCart } from "lucide-react";
import React, { FC } from "react";
import AdditionalFeature from "./AdditionalFeature";
import { additionalFeatures } from "@/app/lib/constants/project-breakdown";
import { IInteractiveBuilder } from "@/types/project-breakdown";

const InteractiveBuilder: FC<IInteractiveBuilder> = ({
  selectedFeatures,
  toggleFeature,
  calculateAdditionalFeaturesSelectedTotal,
  calculateTotalWithoutDiscount,
  phase1Discount,
  calculateDiscountAmount,
  calculateTotalWithDiscount,
  getRecommendation,
  resetSelection,
  totalCoreFeaturesPrice,
}) => {
  return (
    <section className="mb-12">
      <div className="bg-linear-to-br from-neutral-900 to-neutral-800 border-2 border-violet-500/30 rounded-xl p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-full px-4 py-2 mb-4">
            <Gamepad2 className="w-4 h-4 text-violet-400" />
            <span className="text-violet-300 text-sm font-medium">
              Interactive Builder
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Your Platform, Ready for Launch
          </h2>
          <p className="text-neutral-300 text-lg">
            Click features to add them to your custom package!
          </p>
        </div>

        {/* Feature Selection Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {additionalFeatures.map((feature, index) => {
            const isSelected = selectedFeatures.includes(feature.id);
            return (
              <AdditionalFeature
                key={index}
                feature={feature}
                isSelected={isSelected}
                toggleFeature={toggleFeature}
              />
            );
          })}
        </div>

        {/* Results Panel */}
        <div className="bg-neutral-900/80 border border-indigo-500/30 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Selection Summary */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-400" />
                Your Custom Package
              </h3>

              {selectedFeatures.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {additionalFeatures
                    .filter((feature) => selectedFeatures.includes(feature.id))
                    .map((feature) => (
                      <div
                        key={feature.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-neutral-300">
                          {feature.title}
                        </span>
                        <span className="text-indigo-300 font-semibold">
                          ${feature.cost.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-neutral-400 text-sm mb-4 italic">
                  No features selected yet. Click features above to add them!
                </div>
              )}

              <div className="border-t border-neutral-700 pt-3">
                {/* Feature Count */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">
                    Selected Features:
                  </span>
                  <span className="text-indigo-300">
                    {selectedFeatures.length} of {additionalFeatures.length}
                  </span>
                </div>

                {/* Core Features Cost */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-300">
                    Required Core Features
                  </span>
                  <span className="text-neutral-300">
                    ${totalCoreFeaturesPrice.toLocaleString()}
                  </span>
                </div>

                {/* Additional Features Cost */}
                {selectedFeatures.length > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-300">
                      Additional Features
                    </span>
                    <span className="text-neutral-300">
                      $
                      {calculateAdditionalFeaturesSelectedTotal.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Subtotal Before Discount */}
                <div className="flex justify-between items-center mb-2 pt-2 border-t border-neutral-800">
                  <span className="text-neutral-400 text-sm">
                    Subtotal (before discount)
                  </span>
                  <span className="text-neutral-400 text-sm line-through">
                    ${calculateTotalWithoutDiscount().toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span
                    className={
                      phase1Discount ? "text-amber-400" : "text-emerald-400"
                    }
                  >
                    {phase1Discount ? "Phase One Discount (15%)" : ""}
                  </span>
                  <span
                    className={
                      phase1Discount ? "text-amber-400" : "text-emerald-400"
                    }
                  >
                    -${calculateDiscountAmount().toLocaleString()}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-3 border-t-2 border-indigo-500/30">
                  <span className="font-bold text-white text-lg">
                    Total Cost:
                  </span>
                  <span className="font-bold text-indigo-400 text-2xl">
                    ${Math.round(calculateTotalWithDiscount()).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation & Actions */}
            <div className="text-center">
              <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-4 mb-4">
                <div className="text-sm font-semibold mb-2 text-indigo-300">
                  💡 Smart Recommendation
                </div>
                <div className={`text-sm ${getRecommendation()?.color}`}>
                  {getRecommendation()?.text}
                </div>
              </div>

              {selectedFeatures.length > 0 && (
                <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                  <div className="text-sm text-neutral-300 mb-2">
                    Your Investment:
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${Math.round(calculateTotalWithDiscount()).toLocaleString()}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={resetSelection}
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveBuilder;
