import React from "react";
import { motion } from "framer-motion";
import { IHero } from "@/types/entities/hero";

const GrowthTree = ({ hero }: { hero: IHero }) => {
  const percentage = (hero.growthTreeCurrent / hero.growthTreeGoal) * 100;
  const numLeaves = Math.floor((percentage / 100) * 30); // Max 30 leaves for fuller tree

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-800 p-5 w-full max-w-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <div
          className="p-2 rounded-lg ring-2"
          style={
            {
              backgroundColor: `${hero.growthTreeColor}10`,
              "--tw-ring-color": hero.growthTreeColor,
              "--tw-ring-opacity": "0.2",
            } as React.CSSProperties
          }
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: hero.growthTreeColor }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="text-base font-bold text-white">Community Growth</h3>
      </div>

      {/* Tree Visual */}
      <div className="relative h-72 flex items-end justify-center mb-5">
        <svg viewBox="0 0 200 300" className="w-full h-full">
          {/* Ground */}
          <ellipse
            cx="100"
            cy="285"
            rx="60"
            ry="8"
            fill="#44403c"
            opacity="0.3"
          />

          {/* Trunk */}
          <motion.path
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ originY: "100%" }}
            d="M85 285 L88 180 Q90 160 92 140 L108 140 Q110 160 112 180 L115 285 Z"
            fill="#78716c"
          />

          {/* Trunk texture - bark lines */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5 }}
            d="M88 260 Q95 255 88 250 M112 265 Q105 260 112 255 M90 230 Q97 225 90 220 M110 235 Q103 230 110 225 M88 200 Q95 195 88 190 M112 205 Q105 200 112 195 M92 170 Q99 165 92 160 M108 175 Q101 170 108 165"
            stroke="#57534e"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Large foliage clusters - bottom layer */}
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            cx="60"
            cy="160"
            r="35"
            fill={hero.growthTreeColor}
            opacity="0.6"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            cx="140"
            cy="160"
            r="35"
            fill={hero.growthTreeColor}
            opacity="0.6"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            cx="100"
            cy="150"
            r="40"
            fill={hero.growthTreeColor}
            opacity="0.7"
          />

          {/* Middle layer */}
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            cx="75"
            cy="120"
            r="32"
            fill={hero.growthTreeColor}
            opacity="0.75"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            cx="125"
            cy="120"
            r="32"
            fill={hero.growthTreeColor}
            opacity="0.75"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            cx="100"
            cy="105"
            r="38"
            fill={hero.growthTreeColor}
            opacity="0.8"
          />

          {/* Top layer */}
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            cx="85"
            cy="75"
            r="28"
            fill={hero.growthTreeColor}
            opacity="0.85"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            cx="115"
            cy="75"
            r="28"
            fill={hero.growthTreeColor}
            opacity="0.85"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            cx="100"
            cy="55"
            r="30"
            fill={hero.growthTreeColor}
            opacity="0.9"
          />

          {/* Top crown */}
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            cx="100"
            cy="35"
            r="25"
            fill={hero.growthTreeColor}
            opacity="0.95"
          />

          {/* Highlight overlay for depth */}
          <motion.circle
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.4 }}
            cx="90"
            cy="45"
            r="15"
            fill="#ffffff"
          />
          <motion.circle
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 1.4 }}
            cx="110"
            cy="70"
            r="12"
            fill="#ffffff"
          />
          <motion.circle
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 1.4 }}
            cx="95"
            cy="100"
            r="18"
            fill="#ffffff"
          />

          {/* Individual leaves scattered on top */}
          {Array.from({ length: 30 }).map((_, i) => {
            const isVisible = i < numLeaves;
            const leafPositions = [
              // Top cluster
              { x: 100, y: 30, rotation: 45 },
              { x: 95, y: 35, rotation: -20 },
              { x: 105, y: 32, rotation: 60 },
              { x: 92, y: 40, rotation: 10 },
              { x: 108, y: 38, rotation: -45 },
              // Upper middle
              { x: 85, y: 60, rotation: -30 },
              { x: 115, y: 65, rotation: 40 },
              { x: 78, y: 72, rotation: 20 },
              { x: 122, y: 70, rotation: -50 },
              { x: 100, y: 55, rotation: 0 },
              // Middle
              { x: 72, y: 110, rotation: -40 },
              { x: 128, y: 115, rotation: 35 },
              { x: 65, y: 125, rotation: 15 },
              { x: 135, y: 120, rotation: -25 },
              { x: 100, y: 95, rotation: 50 },
              { x: 90, y: 108, rotation: -15 },
              { x: 110, y: 105, rotation: 25 },
              // Lower sections
              { x: 55, y: 155, rotation: -35 },
              { x: 145, y: 160, rotation: 40 },
              { x: 62, y: 168, rotation: 10 },
              { x: 138, y: 165, rotation: -20 },
              { x: 50, y: 145, rotation: 55 },
              { x: 150, y: 150, rotation: -55 },
              // Bottom scattered
              { x: 95, y: 140, rotation: 30 },
              { x: 105, y: 145, rotation: -35 },
              { x: 70, y: 138, rotation: 45 },
              { x: 130, y: 142, rotation: -40 },
              { x: 88, y: 125, rotation: 15 },
              { x: 112, y: 128, rotation: -10 },
              { x: 100, y: 118, rotation: 0 },
            ];
            const pos = leafPositions[i];

            return (
              <motion.g
                key={`leaf-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  isVisible
                    ? {
                        scale: 1,
                        opacity: 0.9,
                        rotate: [pos.rotation, pos.rotation + 5, pos.rotation],
                        y: [0, -1, 0],
                      }
                    : { scale: 0, opacity: 0 }
                }
                transition={{
                  duration: 0.4,
                  delay: 1.5 + i * 0.03,
                  rotate: {
                    duration: 2 + (i % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 1.5 + (i % 2),
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                {/* Leaf shape - more realistic */}
                <path
                  d="M 0,-6 Q 3,-3 3,0 Q 3,3 0,6 Q -1,3 -1,0 Q -1,-3 0,-6 Z"
                  transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}
                  fill={hero.growthTreeColor}
                  stroke={hero.growthTreeColor}
                  strokeWidth="0.5"
                  opacity="0.95"
                  style={{
                    filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.2))`,
                  }}
                />
                {/* Leaf vein */}
                <line
                  x1={pos.x}
                  y1={pos.y - 5}
                  x2={pos.x}
                  y2={pos.y + 5}
                  stroke="#000000"
                  strokeWidth="0.3"
                  opacity="0.15"
                  transform={`rotate(${pos.rotation}, ${pos.x}, ${pos.y})`}
                />
              </motion.g>
            );
          })}

          {/* Roots spreading at base */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            d="M85 285 Q75 290 65 295 M85 285 Q80 292 75 298 M115 285 Q125 290 135 295 M115 285 Q120 292 125 298 M100 285 Q95 290 90 297 M100 285 Q105 290 110 297"
            stroke="#78716c"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Glow effect behind tree */}
          <motion.circle
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 1.4, duration: 1 }}
            cx="100"
            cy="120"
            rx="70"
            ry="90"
            fill={hero.growthTreeColor}
            style={{ filter: "blur(20px)" }}
          />
        </svg>

        {/* Stats Overlay */}
        <div className="absolute -right-2 top-1/3 -translate-y-1/2">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 }}
            className="text-right"
          >
            <div className="text-3xl font-bold text-white whitespace-nowrap leading-none">
              {hero.growthTreeCurrent.toLocaleString()}
            </div>
            <div className="text-xs text-neutral-400 mt-1 font-medium">
              {Math.round(percentage)}% to goal
            </div>
          </motion.div>
        </div>
      </div>

      {/* Goal Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="text-center space-y-3"
      >
        <div>
          <div className="text-neutral-500 text-xs uppercase tracking-wider font-medium mb-1.5">
            {hero.growthTreeLabel}
          </div>
          <div className="text-sm text-neutral-400">
            Next milestone:{" "}
            <span className="font-bold text-white">
              {hero.growthTreeGoal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, delay: 2.4, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              backgroundColor: hero.growthTreeColor,
              boxShadow: `0 0 10px ${hero.growthTreeColor}80`,
            }}
          />
        </div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
          className="text-xs text-neutral-500 italic"
        >
          🌿 {numLeaves} leaves grown!
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GrowthTree;
