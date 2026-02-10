import type { Component, ComponentType, CSSProperties } from '@/types/component';
import { nanoid } from 'nanoid';

export interface AIComponentRequest {
  description: string;
  style?: 'modern' | 'minimal' | 'bold' | 'elegant';
  colorScheme?: string;
}

export interface AIComponentResponse {
  success: boolean;
  component?: Component;
  error?: string;
}

// Component generation templates based on common patterns
const componentPatterns: Record<string, (description: string, style: string) => Component> = {
  hero: (description, style) => ({
    id: nanoid(8),
    type: 'section',
    displayName: 'AI Hero Section',
    props: {
      content: description
    },
    styles: {
      base: getStylePreset('hero', style)
    },
    children: [
      {
        id: nanoid(8),
        type: 'container',
        displayName: 'Hero Content',
        props: {},
        styles: {
          base: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px',
            textAlign: 'center'
          }
        },
        children: [
          {
            id: nanoid(8),
            type: 'heading',
            displayName: 'Hero Title',
            props: {
              content: extractTitle(description) || 'Welcome to Our Platform',
              level: 1
            },
            styles: {
              base: {
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: style === 'dark' ? '#ffffff' : '#1a1a1a'
              }
            }
          },
          {
            id: nanoid(8),
            type: 'text',
            displayName: 'Hero Subtitle',
            props: {
              content: extractSubtitle(description) || 'Create amazing experiences with our innovative solutions'
            },
            styles: {
              base: {
                fontSize: '20px',
                color: style === 'dark' ? '#e0e0e0' : '#666666',
                marginBottom: '32px',
                lineHeight: '1.6'
              }
            }
          },
          {
            id: nanoid(8),
            type: 'button',
            displayName: 'CTA Button',
            props: {
              content: 'Get Started'
            },
            styles: {
              base: {
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '600',
                backgroundColor: '#5b21b6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }
            }
          }
        ]
      }
    ]
  }),
  
  card: (description, style) => ({
    id: nanoid(8),
    type: 'container',
    displayName: 'AI Card',
    props: {},
    styles: {
      base: getStylePreset('card', style)
    },
    children: [
      {
        id: nanoid(8),
        type: 'heading',
        displayName: 'Card Title',
        props: {
          content: extractTitle(description) || 'Feature Card',
          level: 3
        },
        styles: {
          base: {
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '12px'
          }
        }
      },
      {
        id: nanoid(8),
        type: 'text',
        displayName: 'Card Description',
        props: {
          content: description
        },
        styles: {
          base: {
            fontSize: '16px',
            color: '#666666',
            lineHeight: '1.5'
          }
        }
      }
    ]
  }),
  
  features: (description, style) => ({
    id: nanoid(8),
    type: 'section',
    displayName: 'AI Features Section',
    props: {},
    styles: {
      base: {
        padding: '80px 20px',
        backgroundColor: style === 'dark' ? '#1a1a1a' : '#f8f9fa'
      }
    },
    children: [
      {
        id: nanoid(8),
        type: 'container',
        displayName: 'Features Container',
        props: {},
        styles: {
          base: {
            maxWidth: '1200px',
            margin: '0 auto'
          }
        },
        children: [
          {
            id: nanoid(8),
            type: 'heading',
            displayName: 'Features Title',
            props: {
              content: 'Our Features',
              level: 2
            },
            styles: {
              base: {
                fontSize: '36px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '48px'
              }
            }
          },
          {
            id: nanoid(8),
            type: 'grid',
            displayName: 'Features Grid',
            props: {
              content: { columns: 3, gap: '24px' }
            },
            styles: {
              base: {}
            },
            children: generateFeatureCards(description, style)
          }
        ]
      }
    ]
  }),
  
  contact: (description, style) => ({
    id: nanoid(8),
    type: 'section',
    displayName: 'AI Contact Section',
    props: {},
    styles: {
      base: {
        padding: '80px 20px',
        backgroundColor: '#ffffff'
      }
    },
    children: [
      {
        id: nanoid(8),
        type: 'container',
        displayName: 'Contact Container',
        props: {},
        styles: {
          base: {
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center'
          }
        },
        children: [
          {
            id: nanoid(8),
            type: 'heading',
            displayName: 'Contact Title',
            props: {
              content: 'Get in Touch',
              level: 2
            },
            styles: {
              base: {
                fontSize: '36px',
                fontWeight: 'bold',
                marginBottom: '16px'
              }
            }
          },
          {
            id: nanoid(8),
            type: 'text',
            displayName: 'Contact Description',
            props: {
              content: description || 'We\'d love to hear from you. Send us a message!'
            },
            styles: {
              base: {
                fontSize: '18px',
                color: '#666666',
                marginBottom: '32px'
              }
            }
          },
          {
            id: nanoid(8),
            type: 'form',
            displayName: 'Contact Form',
            props: {
              method: 'POST',
              action: '#'
            },
            styles: {
              base: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }
            },
            children: [
              createFormInput('Name', 'text', 'Your name'),
              createFormInput('Email', 'email', 'your@email.com'),
              createFormTextarea('Message', 'Your message...'),
              {
                id: nanoid(8),
                type: 'button',
                displayName: 'Submit Button',
                props: { content: 'Send Message' },
                styles: {
                  base: {
                    padding: '14px 28px',
                    backgroundColor: '#5b21b6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  })
};

function getStylePreset(type: string, style: string): CSSProperties {
  const presets: Record<string, Record<string, CSSProperties>> = {
    hero: {
      modern: {
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff'
      },
      minimal: {
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff'
      },
      bold: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)'
      },
      elegant: {
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        color: '#ffffff'
      }
    },
    card: {
      modern: {
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      },
      minimal: {
        padding: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb'
      },
      bold: {
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
      },
      elegant: {
        padding: '32px',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }
    }
  };
  
  return presets[type]?.[style] || presets[type]?.modern || {};
}

function extractTitle(description: string): string {
  const words = description.split(' ').slice(0, 5);
  return words.join(' ');
}

function extractSubtitle(description: string): string {
  const sentences = description.split(/[.!?]/);
  return sentences[0] || description;
}

function generateFeatureCards(description: string, style: string): Component[] {
  const features = [
    { title: 'Fast Performance', desc: 'Lightning-fast load times and smooth interactions' },
    { title: 'Secure & Reliable', desc: 'Enterprise-grade security for your peace of mind' },
    { title: 'Easy to Use', desc: 'Intuitive interface designed for everyone' }
  ];
  
  return features.map(f => ({
    id: nanoid(8),
    type: 'container' as ComponentType,
    displayName: 'Feature Card',
    props: {},
    styles: {
      base: getStylePreset('card', style)
    },
    children: [
      {
        id: nanoid(8),
        type: 'heading' as ComponentType,
        displayName: 'Feature Title',
        props: { content: f.title, level: 3 },
        styles: { base: { fontSize: '20px', fontWeight: '600', marginBottom: '8px' } }
      },
      {
        id: nanoid(8),
        type: 'text' as ComponentType,
        displayName: 'Feature Description',
        props: { content: f.desc },
        styles: { base: { fontSize: '15px', color: '#666666', lineHeight: '1.5' } }
      }
    ]
  }));
}

function createFormInput(label: string, type: string, placeholder: string): Component {
  return {
    id: nanoid(8),
    type: 'input',
    displayName: `${label} Input`,
    props: {
      type,
      placeholder,
      name: label.toLowerCase()
    },
    styles: {
      base: {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '16px'
      }
    }
  };
}

function createFormTextarea(label: string, placeholder: string): Component {
  return {
    id: nanoid(8),
    type: 'textarea',
    displayName: `${label} Textarea`,
    props: {
      placeholder,
      name: label.toLowerCase(),
      rows: 4
    },
    styles: {
      base: {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '16px',
        resize: 'vertical'
      }
    }
  };
}

function detectComponentType(description: string): string {
  const lower = description.toLowerCase();
  
  if (lower.includes('hero') || lower.includes('landing') || lower.includes('header section')) {
    return 'hero';
  }
  if (lower.includes('feature') || lower.includes('benefit') || lower.includes('service')) {
    return 'features';
  }
  if (lower.includes('contact') || lower.includes('form') || lower.includes('get in touch')) {
    return 'contact';
  }
  if (lower.includes('card') || lower.includes('box') || lower.includes('item')) {
    return 'card';
  }
  
  // Default to card for general descriptions
  return 'card';
}

export async function generateComponent(request: AIComponentRequest): Promise<AIComponentResponse> {
  try {
    // Simulate API delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const componentType = detectComponentType(request.description);
    const style = request.style || 'modern';
    
    const generator = componentPatterns[componentType];
    if (!generator) {
      return {
        success: false,
        error: 'Could not determine component type from description'
      };
    }
    
    const component = generator(request.description, style);
    
    return {
      success: true,
      component
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate component'
    };
  }
}

export const aiComponentService = {
  generateComponent
};
