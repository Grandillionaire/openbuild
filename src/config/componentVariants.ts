import type { ComponentType, ComponentVariant } from '@/types/component';

export const componentVariants: Record<ComponentType, ComponentVariant[]> = {
  // Button Variants
  button: [
    {
      id: 'primary',
      name: 'Primary',
      isDefault: true,
      styles: {
        base: {
          padding: '12px 24px',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'inline-block'
        }
      }
    },
    {
      id: 'secondary',
      name: 'Secondary',
      styles: {
        base: {
          padding: '12px 24px',
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'inline-block'
        }
      }
    },
    {
      id: 'ghost',
      name: 'Ghost',
      styles: {
        base: {
          padding: '12px 24px',
          backgroundColor: 'transparent',
          color: 'var(--color-text)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'inline-block'
        }
      }
    },
    {
      id: 'danger',
      name: 'Danger',
      styles: {
        base: {
          padding: '12px 24px',
          backgroundColor: 'var(--color-error)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'inline-block'
        }
      }
    },
    {
      id: 'success',
      name: 'Success',
      styles: {
        base: {
          padding: '12px 24px',
          backgroundColor: 'var(--color-success)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'inline-block'
        }
      }
    },
    {
      id: 'gradient',
      name: 'Gradient',
      styles: {
        base: {
          padding: '12px 24px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'inline-block'
        }
      }
    }
  ],
  
  // Heading Variants
  heading: [
    {
      id: 'default',
      name: 'Default',
      isDefault: true,
      styles: {
        base: {
          fontSize: '32px',
          fontWeight: 'var(--font-weight-bold)',
          lineHeight: 'var(--line-height-heading)',
          marginBottom: 'var(--spacing-sm)',
          color: 'var(--color-text)'
        }
      }
    },
    {
      id: 'hero',
      name: 'Hero',
      styles: {
        base: {
          fontSize: '48px',
          fontWeight: '800',
          lineHeight: '1.1',
          marginBottom: 'var(--spacing-md)',
          color: 'var(--color-text)',
          letterSpacing: '-0.02em'
        }
      }
    },
    {
      id: 'gradient',
      name: 'Gradient',
      styles: {
        base: {
          fontSize: '40px',
          fontWeight: 'var(--font-weight-bold)',
          lineHeight: 'var(--line-height-heading)',
          marginBottom: 'var(--spacing-sm)',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          backgroundClip: 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent'
        }
      }
    },
    {
      id: 'uppercase',
      name: 'Uppercase',
      styles: {
        base: {
          fontSize: '24px',
          fontWeight: 'var(--font-weight-bold)',
          lineHeight: 'var(--line-height-heading)',
          marginBottom: 'var(--spacing-sm)',
          color: 'var(--color-text)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      }
    }
  ],
  
  // Text Variants
  text: [
    {
      id: 'default',
      name: 'Body',
      isDefault: true,
      styles: {
        base: {
          fontSize: '16px',
          lineHeight: 'var(--line-height)',
          color: 'var(--color-text)',
          marginBottom: 'var(--spacing-sm)'
        }
      }
    },
    {
      id: 'lead',
      name: 'Lead',
      styles: {
        base: {
          fontSize: '20px',
          lineHeight: '1.7',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-md)',
          fontWeight: 'var(--font-weight-normal)'
        }
      }
    },
    {
      id: 'small',
      name: 'Small',
      styles: {
        base: {
          fontSize: '14px',
          lineHeight: 'var(--line-height)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-xs)'
        }
      }
    },
    {
      id: 'quote',
      name: 'Quote',
      styles: {
        base: {
          fontSize: '18px',
          lineHeight: '1.8',
          color: 'var(--color-text)',
          marginBottom: 'var(--spacing-md)',
          fontStyle: 'italic',
          borderLeft: '4px solid var(--color-primary)',
          paddingLeft: 'var(--spacing-md)'
        }
      }
    }
  ],
  
  // Container Variants
  container: [
    {
      id: 'default',
      name: 'Default',
      isDefault: true,
      styles: {
        base: {
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--spacing-md)',
          width: '100%'
        }
      }
    },
    {
      id: 'narrow',
      name: 'Narrow',
      styles: {
        base: {
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 var(--spacing-md)',
          width: '100%'
        }
      }
    },
    {
      id: 'wide',
      name: 'Wide',
      styles: {
        base: {
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 var(--spacing-md)',
          width: '100%'
        }
      }
    },
    {
      id: 'full',
      name: 'Full Width',
      styles: {
        base: {
          maxWidth: '100%',
          margin: '0',
          padding: '0 var(--spacing-md)',
          width: '100%'
        }
      }
    }
  ],
  
  // Section Variants
  section: [
    {
      id: 'default',
      name: 'Default',
      isDefault: true,
      styles: {
        base: {
          padding: 'var(--spacing-xl) 0',
          width: '100%'
        }
      }
    },
    {
      id: 'compact',
      name: 'Compact',
      styles: {
        base: {
          padding: 'var(--spacing-lg) 0',
          width: '100%'
        }
      }
    },
    {
      id: 'spacious',
      name: 'Spacious',
      styles: {
        base: {
          padding: 'var(--spacing-xxl) 0',
          width: '100%'
        }
      }
    },
    {
      id: 'colored',
      name: 'Colored BG',
      styles: {
        base: {
          padding: 'var(--spacing-xl) 0',
          width: '100%',
          backgroundColor: 'var(--color-surface)'
        }
      }
    }
  ],
  
  // Hero Variants
  hero: [
    {
      id: 'centered',
      name: 'Centered',
      isDefault: true,
      styles: {
        base: {
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--spacing-xl) var(--spacing-md)',
          backgroundColor: 'var(--color-surface)'
        }
      }
    },
    {
      id: 'gradient',
      name: 'Gradient',
      styles: {
        base: {
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--spacing-xl) var(--spacing-md)',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          color: 'white'
        }
      }
    },
    {
      id: 'split',
      name: 'Split Layout',
      styles: {
        base: {
          minHeight: '80vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          padding: 'var(--spacing-xl) var(--spacing-md)',
          gap: 'var(--spacing-xl)'
        }
      }
    }
  ],
  
  // Image Variants
  image: [
    {
      id: 'default',
      name: 'Default',
      isDefault: true,
      styles: {
        base: {
          width: '100%',
          height: 'auto',
          display: 'block'
        }
      }
    },
    {
      id: 'rounded',
      name: 'Rounded',
      styles: {
        base: {
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: 'var(--radius-lg)'
        }
      }
    },
    {
      id: 'circle',
      name: 'Circle',
      styles: {
        base: {
          width: '200px',
          height: '200px',
          objectFit: 'cover',
          borderRadius: 'var(--radius-full)'
        }
      }
    },
    {
      id: 'shadowed',
      name: 'With Shadow',
      styles: {
        base: {
          width: '100%',
          height: 'auto',
          display: 'block',
          boxShadow: 'var(--shadow-lg)'
        }
      }
    }
  ],
  
  // Default empty arrays for components without variants
  grid: [],
  flex: [],
  spacer: [],
  link: [],
  features: [],
  cta: [],
  footer: [],
  navigation: []
};