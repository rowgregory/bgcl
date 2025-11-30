import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CircularActivityMonitor = ({}) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);

    return () => {
      clearInterval(rotationInterval);
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-5 bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">System Activity</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-green-400">Active</span>
        </div>
      </div>

      {/* Circular Graph */}
      <div className="relative flex items-center justify-center h-64 mb-6">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute w-56 h-56 rounded-full border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          style={{ rotate: rotation }}
        >
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(6,182,212,1)]" />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full -translate-x-1/2 translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,1)]" />
          <div className="absolute left-0 top-1/2 w-2 h-2 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(168,85,247,1)]" />
        </motion.div>

        {/* Middle ring */}
        <motion.div
          className="absolute w-44 h-44 rounded-full border-2 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          style={{ rotate: -rotation * 0.7 }}
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(168,85,247,1)]" />
          <div className="absolute right-0 top-1/2 w-2 h-2 bg-pink-400 rounded-full translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(236,72,153,1)]" />
        </motion.div>

        {/* Inner pulsing circle */}
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-linear-to-br from-cyan-500/30 via-blue-500/20 to-purple-500/30 border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4),inset_0_0_40px_rgba(6,182,212,0.2)]"
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              87%
            </div>
            <div className="text-xs text-cyan-400">Efficiency</div>
          </div>
        </motion.div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-linear-to-br from-cyan-900/50 to-zinc-900/50 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <div className="text-lg font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
            2.4k
          </div>
          <div className="text-xs text-zinc-400">Sessions</div>
        </div>
        <div className="text-center p-3 bg-linear-to-br from-purple-900/50 to-zinc-900/50 rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <div className="text-lg font-bold text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
            98%
          </div>
          <div className="text-xs text-zinc-400">Uptime</div>
        </div>
        <div className="text-center p-3 bg-linear-to-br from-blue-900/50 to-zinc-900/50 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <div className="text-lg font-bold text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
            156
          </div>
          <div className="text-xs text-zinc-400">Alerts</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CircularActivityMonitor;
