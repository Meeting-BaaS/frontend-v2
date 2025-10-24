"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  cardContainerVariant,
  cardItemVariant,
} from "@/lib/animations/auth-card-stacks";

const MotionImage = motion.create(Image);

export const LogoCard = () => {
  return (
    <motion.div
      variants={cardContainerVariant("0%", 7)}
      initial="hidden"
      animate="visible"
      className="relative flex h-full w-full flex-col justify-between gap-3 rounded-2xl bg-background p-4"
    >
      <MotionImage
        src="/logo.svg"
        alt="Meeting BaaS logo"
        variants={cardItemVariant()}
        priority
        fill
      />
    </motion.div>
  );
};
