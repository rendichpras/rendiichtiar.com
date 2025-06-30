"use client"

import { motion } from "framer-motion"

interface AnimatedTabContentProps {
  children: React.ReactNode
}

export function AnimatedTabContent({ children }: AnimatedTabContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-8"
    >
      {children}
    </motion.div>
  )
} 