import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IHero } from "@/types/entities/hero";

const Countdown = ({ hero }: { hero: IHero }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(hero.countdownDate) - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [hero.countdownDate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-800 p-4 sm:p-6 md:p-8 w-full"
    >
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
          {hero.countdownLabel}
        </h3>
        <div
          className="h-1 w-16 sm:w-20 mx-auto rounded-full"
          style={{ backgroundColor: hero.countdownColor }}
        ></div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hrs", value: timeLeft.hours },
          { label: "Mins", value: timeLeft.minutes },
          { label: "Secs", value: timeLeft.seconds },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div
              className="rounded-lg sm:rounded-xl py-2 sm:py-3 md:py-4 relative overflow-hidden"
              style={{
                backgroundColor: `${hero.countdownColor}20`,
                borderColor: hero.countdownColor,
                borderWidth: "2px",
              }}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 opacity-20 blur-xl"
                style={{ backgroundColor: hero.countdownColor }}
              ></div>

              <div className="relative z-10">
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-0.5 sm:mb-1 font-mono leading-none"
                  style={{ color: hero.countdownColor }}
                >
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 text-center uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 sm:mt-6">
        <div className="h-1.5 sm:h-2 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${100 - (timeLeft.days / 365) * 100}%`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              backgroundColor: hero.countdownColor,
              boxShadow: `0 0 10px ${hero.countdownColor}80`,
            }}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Countdown;
