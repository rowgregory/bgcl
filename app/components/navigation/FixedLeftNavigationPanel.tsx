import React, { FC } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Crown, Shield } from "lucide-react";
import Link from "next/link";
import { IFixedLeftNavigationPanel } from "@/types/navigation";
import useSoundEffect from "@/hooks/useSoundEffect";
import { magicChargeMana2 } from "@/app/lib/constants/sound-effects";
import { useAppDispatch } from "@/app/redux/store";
import { itemVariants } from "@/app/lib/constants/motion";
import { setOpenHeroStudio } from "@/app/redux/features/appSlice";

const FixedLeftNavigationPanel: FC<IFixedLeftNavigationPanel> = ({
  isNavigationCollapsed,
  setIsNavigationCollapsed,
  selectedPage,
  links,
  data,
}) => {
  const { play: cryo } = useSoundEffect(magicChargeMana2, true);
  const dispatch = useAppDispatch();

  return (
    <motion.div
      initial={false}
      animate={{
        width: isNavigationCollapsed ? "80px" : "280px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="lg:fixed left-0 top-0 h-full bg-neutral-900 border-r border-neutral-800 z-20 hidden lg:flex flex-col"
    >
      {/* Navigation Header */}
      <div className="px-4 border-b border-neutral-800 h-[68px] flex items-center justify-between w-full">
        {!isNavigationCollapsed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-3"
          >
            <Link href="/">
              <div
                style={{ backgroundImage: `url('/images/logo-1.webp')` }}
                className="bg-no-repeat bg-center bg-contain w-16 h-16"
              />
            </Link>
          </motion.div>
        ) : (
          <Link href="/">
            <div
              style={{ backgroundImage: `url('/images/logo-1.webp')` }}
              className="bg-no-repeat bg-center bg-contain w-8 h-8"
            />
          </Link>
        )}
        <button
          onClick={() => setIsNavigationCollapsed(!isNavigationCollapsed)}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
        >
          {isNavigationCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-2 px-3">
          {links?.map((item, index: number) =>
            item.linkKey ? (
              <Link href={item.linkKey} key={item.id}>
                <motion.div
                  onClick={
                    item.label === "Cryo Chamber" ? () => cryo() : () => {}
                  }
                  key={item.id}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  custom={index}
                  className={`
              w-full flex items-center justify-center space-x-3 px-3 py-3 rounded-xl transition-all
              ${
                selectedPage === item.label
                  ? "bg-linear-to-r from-violet-600/20 via-indigo-600/20 to-indigo-600/20 text-violet-400 border border-purple-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }
            `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!isNavigationCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1"
                    >
                      <div className="font-medium">{item.label}</div>
                      {item.description && (
                        <div
                          className={`${selectedPage === item.label ? "text-violet-300" : "text-neutral-400"} text-xs mt-0.5`}
                        >
                          {item.description}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            ) : (
              <motion.div
                onClick={() => dispatch(setOpenHeroStudio())}
                key={item.id}
                variants={itemVariants}
                initial="closed"
                animate="open"
                custom={index}
                className={`
              w-full flex items-center justify-center space-x-3 px-3 py-3 rounded-xl transition-all cursor-pointer
              ${
                selectedPage === item.label
                  ? "bg-linear-to-r from-violet-600/20 via-indigo-600/20 to-indigo-600/20 text-violet-400 border border-purple-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }
            `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isNavigationCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div
                        className={`${selectedPage === item.label ? "text-violet-300" : "text-neutral-400"} text-xs mt-0.5`}
                      >
                        {item.description}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )
          )}
        </nav>
      </div>

      {/* Navigation Footer */}
      {!isNavigationCollapsed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-t border-neutral-800"
        >
          <div className="flex items-center space-x-3 p-3 bg-neutral-800/50 rounded-xl">
            <div className="w-8 h-8 bg-linear-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              {data?.user?.role === "SUPERUSER" ? (
                <Crown className="w-4 h-4" />
              ) : data?.user?.role === "ADMIN" ? (
                <Shield className="w-4 h-4" />
              ) : (
                data?.user?.name?.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {data?.user?.name}
              </p>
              <p className="text-neutral-400 text-xs truncate">
                {data?.user?.email}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-t border-neutral-800"
        >
          <div className="py-3 flex items-center justify-center bg-neutral-800/50 rounded-xl">
            <div className="w-8 h-8 bg-linear-to-r from-violet-500 via-indigo-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              {data?.user?.role === "SUPERUSER" ? (
                <Crown className="w-4 h-4" />
              ) : data?.user?.role === "ADMIN" ? (
                <Shield className="w-4 h-4" />
              ) : (
                data?.user?.name?.charAt(0)
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FixedLeftNavigationPanel;
