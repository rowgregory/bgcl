import React, { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IActionItems } from "@/types/navigation";
import { useAppDispatch, useDashboardSelector } from "@/app/redux/store";
import { setCloseActionMenu } from "@/app/redux/features/dashboardSlice";
import Backdrop from "../common/Backdrop";
import { MotionLink } from "../common/MotionLink";

const ActionMenuDropdown: FC<{ actionItems: IActionItems[] }> = ({
  actionItems,
}) => {
  const dispatch = useAppDispatch();
  const { push } = useRouter();
  const onClose = () => dispatch(setCloseActionMenu());
  const { actionMenu } = useDashboardSelector();

  const handleActionClick = (item: IActionItems) => {
    if (item.isUnlocked) {
      dispatch(setCloseActionMenu());
      onClose();
      dispatch(item.open());
    } else {
      push("/admin/expansion-module");
    }
  };

  return (
    <AnimatePresence>
      {actionMenu && (
        <>
          <Backdrop onClose={onClose} />
          <motion.div
            initial={{
              clipPath: "inset(0 0 100% 0)",
              opacity: 0,
            }}
            animate={{
              clipPath: "inset(0 0 0% 0)",
              opacity: 1,
            }}
            exit={{
              clipPath: "inset(0 0 100% 0)",
              opacity: 0,
            }}
            transition={{
              clipPath: {
                duration: 1.35,
                ease: [0.1, 0, 0.9, 1], // Custom bezier: slow first 75%, fast last 25%
              },
              opacity: {
                duration: 1.35,
                ease: "easeInOut",
              },
            }}
            className="absolute z-50 right-18 top-18 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="py-2">
              {actionItems?.map((item, i) => (
                <MotionLink
                  href={item.linkKey}
                  key={i}
                  variants={{
                    closed: {
                      x: -20,
                      opacity: 0,
                    },
                    open: (i: number) => ({
                      x: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.1 + i * 0.15,
                        duration: 0.3,
                        ease: "easeOut" as const,
                      },
                    }),
                  }}
                  initial="closed"
                  animate="open"
                  custom={i}
                  onClick={() => handleActionClick(item)}
                  className={`w-full px-4 py-3 text-left text-gray-200 hover:text-white transition-all flex items-center justify-between hover:bg-indigo-600/10`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                </MotionLink>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActionMenuDropdown;
