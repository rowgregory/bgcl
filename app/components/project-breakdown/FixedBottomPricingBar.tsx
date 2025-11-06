import { Clock, Rocket, Server } from "lucide-react";
import React, { FC } from "react";

const FixedBottomPricingBar: FC<{
  calculateSelectedTotal: () => number;
  totalPrice: number;
  selectedFeatures: string[];
  phase1Discount: boolean;
}> = ({
  calculateSelectedTotal,
  totalPrice,
  selectedFeatures,
  phase1Discount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t-2 border-violet-500 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="py-3 sm:py-4">
          {/* Mobile Layout */}
          <div className="flex flex-col sm:hidden gap-3">
            {/* Price Row */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-neutral-400 line-through">
                  ${(calculateSelectedTotal() + totalPrice).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">
                    $
                    {(
                      (calculateSelectedTotal() + totalPrice) *
                      (phase1Discount ? 0.7 : 0.85)
                    ).toLocaleString()}
                  </span>
                  <span className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    15% OFF
                  </span>
                </div>
              </div>
              <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </button>
            </div>

            {/* Info Row */}
            <div className="flex justify-between text-xs text-neutral-400 border-t border-neutral-800 pt-2">
              <span>{selectedFeatures.length} features</span>
              <span>6-8 weeks</span>
              <span>
                Hosting: ${Math.round(calculateSelectedTotal() * 0.025)}
                /mo
              </span>
            </div>
          </div>

          {/* Tablet/Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            {/* Left Section - Price */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-neutral-400 line-through">
                  Regular: $
                  {(calculateSelectedTotal() + totalPrice).toLocaleString()}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    $
                    {(
                      (calculateSelectedTotal() + totalPrice) *
                      (phase1Discount ? 0.7 : 0.85)
                    ).toLocaleString()}
                  </span>
                  <span className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                    {phase1Discount ? "30" : "15"}% LOCAL DISCOUNT
                  </span>
                </div>
              </div>
            </div>

            {/* Center Section - Stats */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-neutral-300">
                  {selectedFeatures.length} features selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-neutral-300">
                  6-8 weeks delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-neutral-300">
                  ${Math.round(calculateSelectedTotal() * 0.025)}/mo hosting
                </span>
              </div>
            </div>

            {/* Right Section - CTA */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <div className="text-xs text-neutral-400">
                  Boys & Girls Club of Lynn
                </div>
                <div className="text-sm text-violet-300 font-medium">
                  Exclusive License
                </div>
              </div>
              <button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg">
                Get Sqysh&apos;d
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedBottomPricingBar;
