'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Transition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.75 }}
      className="max-h-screen w-full flex justify-center items-center"
    >
      {children}
    </motion.div>
  );
}
