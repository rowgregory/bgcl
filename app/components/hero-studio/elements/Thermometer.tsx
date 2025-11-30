import React from "react";
import { IHero } from "@/types/entities/hero";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

const Thermometer = ({ hero }: { hero: IHero }) => {
  const percentage = (hero.thermometerCurrent / hero.thermometerGoal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-800 p-5 w-full max-w-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-12">
        <div className="p-2 bg-neutral-500/10 rounded-lg ring-2 ring-neutral-500/20">
          <Target
            className="w-4 h-4"
            style={{ color: hero.thermometerColor }}
          />
        </div>
        <h3 className="text-base font-bold text-white">Campaign Progress</h3>
      </div>

      {/* Thermometer */}
      <div className="relative ">
        <div className="flex items-end justify-center h-52">
          <div className="relative">
            {/* Top Cap */}
            <div className="w-10 h-5 bg-neutral-800 rounded-t-full border-2 border-neutral-700 mx-auto"></div>

            {/* Main Tube */}
            <div className="relative w-10 h-40 bg-neutral-800/50 backdrop-blur-sm border-2 border-neutral-700 mx-auto overflow-hidden">
              <div className="absolute inset-1 bg-linear-to-r from-white/5 to-transparent rounded-sm"></div>

              {/* Fill */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute bottom-0 left-0 right-0 rounded-sm"
                style={{
                  backgroundColor: hero.thermometerColor,
                  boxShadow: `inset 0 0 20px ${hero.thermometerColor}80, 0 0 15px ${hero.thermometerColor}40`,
                }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-white/30 via-transparent to-transparent w-1/3"></div>
              </motion.div>

              {/* Tick Marks */}
              <div className="absolute inset-0 flex flex-col justify-between py-2">
                {[100, 75, 50, 25, 0].map((tick) => (
                  <div key={tick} className="relative flex items-center">
                    <div className="w-full h-px bg-neutral-600"></div>
                    <span className="absolute -right-8 text-[10px] text-neutral-500 font-medium">
                      {tick}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulb */}
            <div className="relative -mt-1.5">
              <div
                className="w-20 h-20 rounded-full mx-auto border-3 border-neutral-700 relative overflow-hidden"
                style={{
                  backgroundColor: hero.thermometerColor,
                  boxShadow: `inset 0 0 30px ${hero.thermometerColor}cc, 0 0 40px ${hero.thermometerColor}60, 0 0 80px ${hero.thermometerColor}30`,
                }}
              >
                <div className="absolute inset-0">
                  <div className="absolute top-1.5 left-1.5 w-7 h-7 bg-white/40 rounded-full blur-md"></div>
                  <div className="absolute bottom-2.5 right-2.5 w-10 h-10 bg-white/10 rounded-full blur-lg"></div>
                </div>
                <div className="absolute inset-2.5 border-2 border-white/20 rounded-full"></div>
              </div>
            </div>

            {/* Percentage Label */}
            <div className="absolute left-full ml-2 top-1/3 -translate-y-1/2">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold text-white whitespace-nowrap leading-none"
              >
                {Math.round(percentage)}%
              </motion.div>
              <div className="text-xs text-neutral-400 mt-1.5 font-medium">
                Complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Amount */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-5 text-center"
      >
        <div className="text-neutral-500 text-xs uppercase tracking-wider font-medium mb-1.5">
          Campaign Goal
        </div>
        <div
          className="text-3xl font-bold"
          style={{ color: hero.thermometerColor }}
        >
          ${hero.thermometerGoal.toLocaleString()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Thermometer;
