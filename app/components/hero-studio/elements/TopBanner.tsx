// components/TopBanner.tsx
import { motion } from "framer-motion";
import Link from "next/link";

interface TopBannerProps {
  text: string;
  height: string;
  bgColor: string;
  textColor: string;
  fontSize: string;
  bold: boolean;
  linkType: "none" | "internal" | "external";
  link: string;
}

export const TopBanner = ({
  text,
  height,
  bgColor,
  textColor,
  fontSize,
  bold,
  linkType,
  link,
}: TopBannerProps) => {
  const content = (
    <div
      className="w-full flex items-center justify-center px-4 cursor-pointer hover:opacity-90 transition-opacity"
      style={{
        height: `${height}px`,
        backgroundColor: bgColor,
        color: textColor,
        fontSize: `${fontSize}rem`,
        fontWeight: bold ? 700 : 400,
      }}
    >
      {text}
    </div>
  );

  if (linkType === "none") {
    return (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {content}
      </motion.div>
    );
  }

  if (linkType === "internal") {
    return (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href={link || "/"}>{content}</Link>
      </motion.div>
    );
  }

  // External link
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <a href={link || "#"} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    </motion.div>
  );
};
