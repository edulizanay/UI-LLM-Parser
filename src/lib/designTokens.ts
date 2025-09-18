// ABOUTME: Single source of truth for all design system values
// ABOUTME: Provides type-safe, enforceable design tokens to prevent hardcoded values

/**
 * Design System Tokens
 * Based on Yuki Design analysis of prompt_tester and conversation parser requirements
 *
 * Usage:
 *   import { colors, spacing, typography } from '@/lib/designTokens'
 *   className={`bg-[${colors.primary.blue}] text-[${colors.text.primary}]`}
 *
 * Or via Tailwind utilities:
 *   className="bg-primary-blue text-text-primary"
 */

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const colors = {
  // Primary Interactive Colors
  primary: {
    blue: '#3b82f6',
    blueHover: '#2563eb',
  },

  // Field Categorization Colors
  field: {
    computerFriendly: '#1e40af',
    computerFriendlyLight: '#3b82f6',
    llmFriendly: '#dc2626',
    llmFriendlyLight: '#f87171',
  },

  // Surface Colors
  surface: {
    background: '#f8fafc',
    white: '#ffffff',
    codeBackground: '#fafafa',
    messagesField: '#f1f5f9',
    messagesFieldHover: '#e2e8f0',
  },

  // Border Colors
  border: {
    default: '#e2e8f0',
    focus: '#3b82f6',
  },

  // Text Colors
  text: {
    primary: '#334155',
    secondary: '#64748b',
    muted: '#94a3b8',
    rawData: '#64748b',
  },

  // State Colors
  state: {
    success: {
      text: '#166534',
      background: '#dcfce7',
    },
    warning: {
      text: '#d97706',
      background: '#fef3c7',
    },
    error: {
      text: '#dc2626',
      background: '#fef2f2',
    },
  },

  // Special Interaction States
  interaction: {
    selectedOpacity: '0.8',
    dimmedOpacity: '0.4',
    hoverTransition: '0.2s',
  },
} as const

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
  },

  // Font Sizes
  fontSize: {
    display: '24px',
    heading: '18px',
    body: '14px',
    small: '13px',
    micro: '11px',
    statusMicro: '12px',
  },

  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
  },

  // Line Heights
  lineHeight: {
    tight: '1.4',
    normal: '1.5',
    relaxed: '1.6',
  },
} as const

// =============================================================================
// SPACING TOKENS
// =============================================================================

export const spacing = {
  // Base spacing unit (all spacing should be multiples of this)
  base: '4px',

  // Common spacing values
  micro: '6px',        // tight relationships
  small: '12px',       // component spacing
  medium: '16px',      // standard gaps
  large: '20px',       // section gaps
  xlarge: '24px',      // major content separation

  // Component-specific spacing
  panelPadding: '16px',
  panelPaddingLarge: '20px',
  formPadding: '8px',
  formPaddingMedium: '12px',
} as const

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const components = {
  // Border Radius
  borderRadius: {
    small: '4px',
    medium: '6px',
    large: '8px',
    status: '12px',
  },

  // Shadows
  shadow: {
    panel: '0 1px 3px rgba(0,0,0,0.1)',
    focus: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },

  // Transitions
  transition: {
    fast: '0.2s',
    easing: 'ease-out',
  },
} as const

// =============================================================================
// SEMANTIC TOKENS (Field Categorization)
// =============================================================================

export const semantic = {
  // Field type categorization
  fieldTypes: {
    computerFriendly: {
      color: colors.field.computerFriendly,
      description: 'Data that computers can easily process (IDs, dates, counts)',
    },
    llmFriendly: {
      color: colors.field.llmFriendly,
      description: 'Content that benefits from LLM analysis (text, conversations)',
    },
  },

  // Interaction states
  states: {
    selected: {
      opacity: colors.interaction.selectedOpacity,
    },
    dimmed: {
      opacity: colors.interaction.dimmedOpacity,
    },
    hover: {
      transition: colors.interaction.hoverTransition,
    },
  },
} as const

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type ColorValue = string
export type FieldType = 'computer_friendly' | 'llm_friendly'

export interface FieldTypeConfig {
  color: ColorValue
  description: string
}

// =============================================================================
// TRUNCATION UTILITIES
// =============================================================================

export const truncation = {
  // CSS-only truncation classes
  singleLine: {
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
  },

  // Max widths for different field contexts
  maxWidths: {
    fieldValue: '300px',        // For regular field values
    messageContent: '400px',    // For message content
    metadata: '250px',         // For metadata fields
    compact: '200px',          // For compact displays
  },

  // Responsive max widths
  responsive: {
    sm: '150px',   // Small screens
    md: '250px',   // Medium screens
    lg: '350px',   // Large screens
    xl: '450px',   // Extra large screens
  }
} as const

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get color for field type categorization
 */
export const getFieldTypeColor = (type: FieldType): ColorValue => {
  switch (type) {
    case 'computer_friendly':
      return semantic.fieldTypes.computerFriendly.color
    case 'llm_friendly':
      return semantic.fieldTypes.llmFriendly.color
    default:
      return colors.text.secondary
  }
}

/**
 * Get Tailwind class name for field type
 */
export const getFieldTypeClass = (type: FieldType): string => {
  switch (type) {
    case 'computer_friendly':
      return 'text-field-computer-friendly'
    case 'llm_friendly':
      return 'text-field-llm-friendly'
    default:
      return 'text-text-secondary'
  }
}

/**
 * Get truncation styles for field values
 */
export const getTruncationStyles = (
  context: keyof typeof truncation.maxWidths = 'fieldValue'
): React.CSSProperties => {
  return {
    ...truncation.singleLine,
    maxWidth: truncation.maxWidths[context],
  }
}

/**
 * Get Tailwind classes for truncation
 */
export const getTruncationClasses = (
  context: keyof typeof truncation.maxWidths = 'fieldValue'
): string => {
  const maxWidthClass = {
    fieldValue: 'max-w-[300px]',
    messageContent: 'max-w-[400px]',
    metadata: 'max-w-[250px]',
    compact: 'max-w-[200px]',
  }[context]

  return `whitespace-nowrap overflow-hidden text-ellipsis ${maxWidthClass}`
}

/**
 * Generate CSS custom properties for dynamic usage
 */
export const generateCSSProperties = () => {
  return {
    '--color-primary-blue': colors.primary.blue,
    '--color-primary-blue-hover': colors.primary.blueHover,
    '--color-field-computer-friendly': colors.field.computerFriendly,
    '--color-field-llm-friendly': colors.field.llmFriendly,
    '--color-surface-background': colors.surface.background,
    '--color-surface-white': colors.surface.white,
    '--color-text-primary': colors.text.primary,
    '--color-text-secondary': colors.text.secondary,
    '--spacing-base': spacing.base,
    '--border-radius-medium': components.borderRadius.medium,
    '--transition-fast': components.transition.fast,
  }
}