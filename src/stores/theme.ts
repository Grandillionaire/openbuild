import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
  };
  typography: {
    fontFamily: string;
    fontFamilyHeading: string;
    baseFontSize: string;
    lineHeight: number;
    headingLineHeight: number;
    fontWeightNormal: number;
    fontWeightMedium: number;
    fontWeightBold: number;
  };
  spacing: {
    unit: number; // Base unit in pixels
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Default theme
const defaultTheme: DesignTokens = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981'
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyHeading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    baseFontSize: '16px',
    lineHeight: 1.5,
    headingLineHeight: 1.2,
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700
  },
  spacing: {
    unit: 8,
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
};

// Preset themes
export const presetThemes = {
  default: defaultTheme,
  dark: {
    ...defaultTheme,
    colors: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      accent: '#fbbf24',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      error: '#f87171',
      warning: '#fbbf24',
      success: '#34d399'
    }
  },
  corporate: {
    ...defaultTheme,
    colors: {
      primary: '#1e40af',
      secondary: '#7c3aed',
      accent: '#dc2626',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#475569',
      border: '#e2e8f0',
      error: '#dc2626',
      warning: '#d97706',
      success: '#059669'
    },
    typography: {
      ...defaultTheme.typography,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontFamilyHeading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }
  },
  playful: {
    ...defaultTheme,
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: '#fef3c7',
      surface: '#fde68a',
      text: '#78350f',
      textSecondary: '#92400e',
      border: '#f59e0b',
      error: '#dc2626',
      warning: '#f59e0b',
      success: '#10b981'
    },
    typography: {
      ...defaultTheme.typography,
      fontFamily: '"Comic Neue", cursive, sans-serif',
      fontFamilyHeading: '"Fredoka", cursive, sans-serif'
    },
    borderRadius: {
      none: '0',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      full: '9999px'
    }
  },
  minimal: {
    ...defaultTheme,
    colors: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#000000',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0',
      error: '#ff0000',
      warning: '#ff9800',
      success: '#4caf50'
    },
    typography: {
      ...defaultTheme.typography,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontFamilyHeading: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeightNormal: 300,
      fontWeightMedium: 400,
      fontWeightBold: 500
    },
    borderRadius: {
      none: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      full: '0'
    }
  }
};

export const useThemeStore = defineStore('theme', () => {
  // State
  const activeTheme = ref<DesignTokens>(defaultTheme);
  const themeName = ref('default');
  
  // Computed
  const cssVariables = computed(() => {
    const vars: Record<string, string> = {};
    const theme = activeTheme.value;
    
    // Colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      vars[`--color-${key}`] = value;
    });
    
    // Typography
    vars['--font-family'] = theme.typography.fontFamily;
    vars['--font-family-heading'] = theme.typography.fontFamilyHeading;
    vars['--font-size-base'] = theme.typography.baseFontSize;
    vars['--line-height'] = theme.typography.lineHeight.toString();
    vars['--line-height-heading'] = theme.typography.headingLineHeight.toString();
    vars['--font-weight-normal'] = theme.typography.fontWeightNormal.toString();
    vars['--font-weight-medium'] = theme.typography.fontWeightMedium.toString();
    vars['--font-weight-bold'] = theme.typography.fontWeightBold.toString();
    
    // Spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      if (key !== 'unit') {
        vars[`--spacing-${key}`] = value;
      }
    });
    
    // Border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      vars[`--radius-${key}`] = value;
    });
    
    // Shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      vars[`--shadow-${key}`] = value;
    });
    
    return vars;
  });
  
  // Actions
  function setTheme(name: keyof typeof presetThemes) {
    if (presetThemes[name]) {
      activeTheme.value = { ...presetThemes[name] };
      themeName.value = name;
      applyThemeToDocument();
    }
  }
  
  function updateThemeTokens(tokens: Partial<DesignTokens>) {
    activeTheme.value = {
      ...activeTheme.value,
      ...tokens,
      colors: { ...activeTheme.value.colors, ...(tokens.colors || {}) },
      typography: { ...activeTheme.value.typography, ...(tokens.typography || {}) },
      spacing: { ...activeTheme.value.spacing, ...(tokens.spacing || {}) },
      borderRadius: { ...activeTheme.value.borderRadius, ...(tokens.borderRadius || {}) },
      shadows: { ...activeTheme.value.shadows, ...(tokens.shadows || {}) }
    };
    themeName.value = 'custom';
    applyThemeToDocument();
  }
  
  function applyThemeToDocument() {
    const root = document.documentElement;
    Object.entries(cssVariables.value).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
  
  function getThemeValue(path: string): string | number {
    const keys = path.split('.');
    let value: any = activeTheme.value;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return '';
      }
    }
    
    return value;
  }
  
  return {
    // State
    activeTheme,
    themeName,
    
    // Computed
    cssVariables,
    
    // Actions
    setTheme,
    updateThemeTokens,
    applyThemeToDocument,
    getThemeValue,
    
    // Constants
    presetThemes
  };
});