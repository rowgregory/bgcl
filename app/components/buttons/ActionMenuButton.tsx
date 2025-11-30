import React from "react";
import { motion } from "framer-motion";
import { Plus, ChevronDown } from "lucide-react";
import { useAppDispatch, useDashboardSelector } from "@/app/redux/store";
import useSoundEffect from "@/hooks/useSoundEffect";
import { setOpenActionMenu } from "../../redux/features/dashboardSlice";

const ActionMenuButton = () => {
  const dispatch = useAppDispatch();
  const { actionMenu } = useDashboardSelector();
  const { play } = useSoundEffect("/sound-effects/action-menu-1.mp3", true);

  const handleOpenActionMenu = () => {
    play();
    dispatch(setOpenActionMenu());
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleOpenActionMenu}
      className="px-4 py-2 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-violet-600 transition-all flex items-center space-x-2 font-medium shadow-lg text-sm"
    >
      <Plus className="w-4 h-4" />
      <span>Actions</span>
      <ChevronDown
        className={`w-4 h-4 transition-transform ${actionMenu ? "rotate-180" : ""}`}
      />
    </motion.button>
  );
};

export default ActionMenuButton;
