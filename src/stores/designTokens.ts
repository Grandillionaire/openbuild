import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface ColorToken {
  id: string;
  name: string;
  value: string;
  category: 'primary' | 'secondary' | 'accent' | 'neutral' | 'semantic';
}

export interface TypographyToken {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string | number;
  lineHeight: string;
  letterSpacing?: string;
}

export interface SpacingToken {
  id: string;
  name: string;
  value: string;
}

export interface BreakpointToken {
  id: string;
  name: string;
  value: string;
}

export interface ShadowToken {
  id: string;
  name: string;
  value: string;
}

export interface RadiusToken {
  id: string;
  name: string;
  value: string;
}

export interface DesignTokens {
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  breakpoints: BreakpointToken[];
  shadows: ShadowToken[];
  radii: RadiusToken[];
}

export const useDesignTokensStore = defineStore('designTokens', () => {
  // Color Tokens
  const colors = ref<ColorToken[]>([
    // Primary Colors
    { id: 'primary-50', name: 'Primary 50', value: '#EEF2FF', category: 'primary' },
    { id: 'primary-100', name: 'Primary 100', value: '#E0E7FF', category: 'primary' },
    { id: 'primary-200', name: 'Primary 200', value: '#C7D2FE', category: 'primary' },
    { id: 'primary-300', name: 'Primary 300', value: '#A5B4FC', category: 'primary' },
    { id: 'primary-400', name: 'Primary 400', value: '#818CF8', category: 'primary' },
    { id: 'primary-500', name: 'Primary 500', value: '#6366F1', category: 'primary' },
    { id: 'primary-600', name: 'Primary 600', value: '#4F46E5', category: 'primary' },
    { id: 'primary-700', name: 'Primary 700', value: '#4338CA', category: 'primary' },
    { id: 'primary-800', name: 'Primary 800', value: '#3730A3', category: 'primary' },
    { id: 'primary-900', name: 'Primary 900', value: '#312E81', category: 'primary' },

    // Neutral Colors
    { id: 'gray-50', name: 'Gray 50', value: '#F9FAFB', category: 'neutral' },
    { id: 'gray-100', name: 'Gray 100', value: '#F3F4F6', category: 'neutral' },
    { id: 'gray-200', name: 'Gray 200', value: '#E5E7EB', category: 'neutral' },
    { id: 'gray-300', name: 'Gray 300', value: '#D1D5DB', category: 'neutral' },
    { id: 'gray-400', name: 'Gray 400', value: '#9CA3AF', category: 'neutral' },
    { id: 'gray-500', name: 'Gray 500', value: '#6B7280', category: 'neutral' },
    { id: 'gray-600', name: 'Gray 600', value: '#4B5563', category: 'neutral' },
    { id: 'gray-700', name: 'Gray 700', value: '#374151', category: 'neutral' },
    { id: 'gray-800', name: 'Gray 800', value: '#1F2937', category: 'neutral' },
    { id: 'gray-900', name: 'Gray 900', value: '#111827', category: 'neutral' },

    // Semantic Colors
    { id: 'success', name: 'Success', value: '#10B981', category: 'semantic' },
    { id: 'warning', name: 'Warning', value: '#F59E0B', category: 'semantic' },
    { id: 'error', name: 'Error', value: '#EF4444', category: 'semantic' },
    { id: 'info', name: 'Info', value: '#3B82F6', category: 'semantic' }
  ]);

  // Typography Tokens
  const typography = ref<TypographyToken[]>([
    {
      id: 'heading-xl',
      name: 'Heading XL',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: '1.2'
    },
    {
      id: 'heading-lg',
      name: 'Heading Large',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: '1.3'
    },
    {
      id: 'heading-md',
      name: 'Heading Medium',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: '1.3'
    },
    {
      id: 'heading-sm',
      name: 'Heading Small',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: '1.4'
    },
    {
      id: 'body-lg',
      name: 'Body Large',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: '1.75'
    },
    {
      id: 'body-md',
      name: 'Body Medium',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5'
    },
    {
      id: 'body-sm',
      name: 'Body Small',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.5'
    },
    {
      id: 'caption',
      name: 'Caption',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: '1.5'
    }
  ]);

  // Spacing Tokens (following 8px grid system)
  const spacing = ref<SpacingToken[]>([
    { id: 'space-0', name: '0', value: '0' },
    { id: 'space-1', name: '1', value: '0.25rem' },   // 4px
    { id: 'space-2', name: '2', value: '0.5rem' },    // 8px
    { id: 'space-3', name: '3', value: '0.75rem' },   // 12px
    { id: 'space-4', name: '4', value: '1rem' },      // 16px
    { id: 'space-5', name: '5', value: '1.25rem' },   // 20px
    { id: 'space-6', name: '6', value: '1.5rem' },    // 24px
    { id: 'space-8', name: '8', value: '2rem' },      // 32px
    { id: 'space-10', name: '10', value: '2.5rem' },  // 40px
    { id: 'space-12', name: '12', value: '3rem' },    // 48px
    { id: 'space-16', name: '16', value: '4rem' },    // 64px
    { id: 'space-20', name: '20', value: '5rem' },    // 80px
    { id: 'space-24', name: '24', value: '6rem' },    // 96px
    { id: 'space-32', name: '32', value: '8rem' }     // 128px
  ]);

  // Breakpoint Tokens
  const breakpoints = ref<BreakpointToken[]>([
    { id: 'sm', name: 'Small (Mobile)', value: '640px' },
    { id: 'md', name: 'Medium (Tablet)', value: '768px' },
    { id: 'lg', name: 'Large (Desktop)', value: '1024px' },
    { id: 'xl', name: 'Extra Large', value: '1280px' },
    { id: '2xl', name: '2X Large', value: '1536px' }
  ]);

  // Shadow Tokens
  const shadows = ref<ShadowToken[]>([
    { id: 'shadow-none', name: 'None', value: 'none' },
    { id: 'shadow-sm', name: 'Small', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    { id: 'shadow-md', name: 'Medium', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' },
    { id: 'shadow-lg', name: 'Large', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)' },
    { id: 'shadow-xl', name: 'Extra Large', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' },
    { id: 'shadow-2xl', name: '2X Large', value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
    { id: 'shadow-inner', name: 'Inner', value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)' }
  ]);

  // Border Radius Tokens
  const radii = ref<RadiusToken[]>([
    { id: 'radius-none', name: 'None', value: '0' },
    { id: 'radius-sm', name: 'Small', value: '0.125rem' },   // 2px
    { id: 'radius-md', name: 'Medium', value: '0.375rem' },   // 6px
    { id: 'radius-lg', name: 'Large', value: '0.5rem' },      // 8px
    { id: 'radius-xl', name: 'Extra Large', value: '0.75rem' }, // 12px
    { id: 'radius-2xl', name: '2X Large', value: '1rem' },    // 16px
    { id: 'radius-3xl', name: '3X Large', value: '1.5rem' },  // 24px
    { id: 'radius-full', name: 'Full (Circle)', value: '9999px' }
  ]);

  // Computed
  const colorsByCategory = computed(() => {
    const categorized: Record<string, ColorToken[]> = {
      primary: [],
      secondary: [],
      accent: [],
      neutral: [],
      semantic: []
    };

    colors.value.forEach(color => {
      categorized[color.category].push(color);
    });

    return categorized;
  });

  const allTokens = computed<DesignTokens>(() => ({
    colors: colors.value,
    typography: typography.value,
    spacing: spacing.value,
    breakpoints: breakpoints.value,
    shadows: shadows.value,
    radii: radii.value
  }));

  // Actions
  function addColor(color: ColorToken) {
    colors.value.push(color);
  }

  function updateColor(id: string, updates: Partial<ColorToken>) {
    const index = colors.value.findIndex(c => c.id === id);
    if (index !== -1) {
      colors.value[index] = { ...colors.value[index], ...updates };
    }
  }

  function removeColor(id: string) {
    colors.value = colors.value.filter(c => c.id !== id);
  }

  function addTypography(token: TypographyToken) {
    typography.value.push(token);
  }

  function updateTypography(id: string, updates: Partial<TypographyToken>) {
    const index = typography.value.findIndex(t => t.id === id);
    if (index !== -1) {
      typography.value[index] = { ...typography.value[index], ...updates };
    }
  }

  function addSpacing(token: SpacingToken) {
    spacing.value.push(token);
  }

  function addShadow(token: ShadowToken) {
    shadows.value.push(token);
  }

  function addRadius(token: RadiusToken) {
    radii.value.push(token);
  }

  // Export as CSS variables
  function generateCSSVariables(): string {
    let css = ':root {\n';

    // Colors
    colors.value.forEach(color => {
      css += `  --color-${color.id}: ${color.value};\n`;
    });

    // Spacing
    spacing.value.forEach(space => {
      css += `  --spacing-${space.id}: ${space.value};\n`;
    });

    // Shadows
    shadows.value.forEach(shadow => {
      css += `  --shadow-${shadow.id}: ${shadow.value};\n`;
    });

    // Radii
    radii.value.forEach(radius => {
      css += `  --radius-${radius.id}: ${radius.value};\n`;
    });

    // Typography
    typography.value.forEach(typo => {
      css += `  --font-${typo.id}-family: ${typo.fontFamily};\n`;
      css += `  --font-${typo.id}-size: ${typo.fontSize};\n`;
      css += `  --font-${typo.id}-weight: ${typo.fontWeight};\n`;
      css += `  --font-${typo.id}-line-height: ${typo.lineHeight};\n`;
      if (typo.letterSpacing) {
        css += `  --font-${typo.id}-letter-spacing: ${typo.letterSpacing};\n`;
      }
    });

    css += '}\n';
    return css;
  }

  // Export as JavaScript object
  function generateTokensObject(): DesignTokens {
    return allTokens.value;
  }

  // Import tokens from JSON
  function importTokens(tokens: Partial<DesignTokens>) {
    if (tokens.colors) colors.value = tokens.colors;
    if (tokens.typography) typography.value = tokens.typography;
    if (tokens.spacing) spacing.value = tokens.spacing;
    if (tokens.breakpoints) breakpoints.value = tokens.breakpoints;
    if (tokens.shadows) shadows.value = tokens.shadows;
    if (tokens.radii) radii.value = tokens.radii;
  }

  // Find token by ID
  function findColorById(id: string): ColorToken | undefined {
    return colors.value.find(c => c.id === id);
  }

  function findTypographyById(id: string): TypographyToken | undefined {
    return typography.value.find(t => t.id === id);
  }

  function findSpacingById(id: string): SpacingToken | undefined {
    return spacing.value.find(s => s.id === id);
  }

  return {
    // State
    colors,
    typography,
    spacing,
    breakpoints,
    shadows,
    radii,

    // Computed
    colorsByCategory,
    allTokens,

    // Actions
    addColor,
    updateColor,
    removeColor,
    addTypography,
    updateTypography,
    addSpacing,
    addShadow,
    addRadius,
    generateCSSVariables,
    generateTokensObject,
    importTokens,
    findColorById,
    findTypographyById,
    findSpacingById
  };
});
