// ABOUTME: Utility functions for className merging and conditional styling
// ABOUTME: Core utilities supporting ShadCN components and design system

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge and deduplicate Tailwind CSS classes
 * Used throughout ShadCN components for conditional styling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}