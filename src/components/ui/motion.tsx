"use client"

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ReactNode } from 'react'

// Page transition animations
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
}

// Stagger animations for lists
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0
  }
}

// Modal animations
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1
  },
  exit: {
    opacity: 0,
    scale: 0.8
  }
}

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

// Slide animations
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0
  }
}

export const slideInVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50
  },
  visible: {
    opacity: 1,
    x: 0
  }
}

// Scale hover animation
export const scaleHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 }
}

// Component wrappers
interface AnimatedPageProps {
  children: ReactNode
  className?: string
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedListProps {
  children: ReactNode
  className?: string
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

interface AnimatedListItemProps {
  children: ReactNode
  className?: string
}

export function AnimatedListItem({ children, className }: AnimatedListItemProps) {
  return (
    <motion.div
      className={className}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedModalProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function AnimatedModal({ children, isOpen, onClose, className }: AnimatedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ children, delay = 0, duration = 0.3, className }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  )
}

interface SlideUpProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function SlideUp({ children, delay = 0, className }: SlideUpProps) {
  return (
    <motion.div
      className={className}
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

interface ScaleOnHoverProps {
  children: ReactNode
  className?: string
}

export function ScaleOnHover({ children, className }: ScaleOnHoverProps) {
  return (
    <motion.div
      className={className}
      variants={scaleHoverVariants}
      initial="rest"
      whileHover="hover"
    >
      {children}
    </motion.div>
  )
}
