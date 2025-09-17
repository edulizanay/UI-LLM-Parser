// ABOUTME: Tailwind CSS configuration for the conversation parser platform
// ABOUTME: Integrates design tokens and configures theme with type-safe color system

const { colors, spacing, typography, components } = require('./src/lib/designTokens')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Design System Colors from designTokens.ts
      colors: {
        // Primary interactive colors
        'primary-blue': colors.primary.blue,
        'primary-blue-hover': colors.primary.blueHover,

        // Field categorization colors
        'field-computer-friendly': colors.field.computerFriendly,
        'field-computer-friendly-light': colors.field.computerFriendlyLight,
        'field-llm-friendly': colors.field.llmFriendly,
        'field-llm-friendly-light': colors.field.llmFriendlyLight,

        // Surface colors
        'surface-background': colors.surface.background,
        'surface-white': colors.surface.white,
        'surface-code': colors.surface.codeBackground,
        'surface-messages': colors.surface.messagesField,
        'surface-messages-hover': colors.surface.messagesFieldHover,

        // Text colors
        'text-primary': colors.text.primary,
        'text-secondary': colors.text.secondary,
        'text-muted': colors.text.muted,
        'text-raw-data': colors.text.rawData,

        // State colors
        'state-success': colors.state.success.text,
        'state-success-bg': colors.state.success.background,
        'state-warning': colors.state.warning.text,
        'state-warning-bg': colors.state.warning.background,
        'state-error': colors.state.error.text,
        'state-error-bg': colors.state.error.background,

        // Border colors
        'border-default': colors.border.default,
        'border-focus': colors.border.focus,

        // shadcn compatibility (keeping existing tokens)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      // Design System Spacing
      spacing: {
        'ds-micro': spacing.micro,
        'ds-small': spacing.small,
        'ds-medium': spacing.medium,
        'ds-large': spacing.large,
        'ds-xlarge': spacing.xlarge,
        'ds-panel': spacing.panelPadding,
        'ds-panel-lg': spacing.panelPaddingLarge,
        'ds-form': spacing.formPadding,
        'ds-form-md': spacing.formPaddingMedium,
      },

      // Design System Typography
      fontFamily: {
        'system': typography.fontFamily.system.split(', '),
        'mono': typography.fontFamily.mono.split(', '),
      },

      fontSize: {
        'ds-display': typography.fontSize.display,
        'ds-heading': typography.fontSize.heading,
        'ds-body': typography.fontSize.body,
        'ds-small': typography.fontSize.small,
        'ds-micro': typography.fontSize.micro,
      },

      // Design System Border Radius
      borderRadius: {
        'ds-sm': components.borderRadius.small,
        'ds-md': components.borderRadius.medium,
        'ds-lg': components.borderRadius.large,
        'ds-status': components.borderRadius.status,

        // shadcn compatibility
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // Design System Shadows
      boxShadow: {
        'ds-panel': components.shadow.panel,
        'ds-focus': components.shadow.focus,
      },

      // Design System Transitions
      transitionDuration: {
        'ds-fast': components.transition.fast,
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}