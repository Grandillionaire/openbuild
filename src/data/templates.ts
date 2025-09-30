import type { Template } from '@/types/template';
import { nanoid } from 'nanoid';

// Helper function to generate unique IDs for template components
function generateId(): string {
  return nanoid(8);
}

// Import templates from category files
import { 
  saasLandingTemplate, 
  productLaunchTemplate, 
  agencyLandingTemplate 
} from './templates/landingTemplates';

import {
  designerPortfolioTemplate,
  developerPortfolioTemplate,
  photographerPortfolioTemplate
} from './templates/portfolioTemplates';

import {
  techBlogTemplate,
  personalBlogTemplate,
  magazineBlogTemplate
} from './templates/blogTemplates';

import {
  modernStartupTemplate,
  professionalAgencyTemplate
} from './templates/modernTemplates';

import {
  ecommerceTemplate
} from './templates/ecommerceTemplate';

// Landing Page Templates
const modernLandingTemplate: Template = {
  id: 'tpl_modern_landing',
  name: 'Modern Landing Page',
  category: 'landing',
  description: 'Clean and modern landing page with hero section, features, and CTA',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZmFmYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+TW9kZXJuIExhbmRpbmcgUGFnZTwvdGV4dD48L3N2Zz4=',
  tags: ['modern', 'minimal', 'hero', 'features', 'cta'],
  components: [
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Navigation',
      props: {
        content: {
          logo: 'YourLogo',
          links: [
            { text: 'Home', href: '#' },
            { text: 'Features', href: '#features' },
            { text: 'Pricing', href: '#pricing' },
            { text: 'Contact', href: '#contact' }
          ]
        }
      },
      styles: {
        base: {
          position: 'fixed',
          top: '0',
          width: '100%',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          zIndex: '100',
          padding: '1rem 0'
        }
      }
    },
    {
      id: generateId(),
      type: 'hero',
      displayName: 'Hero Section',
      props: {
        content: {
          heading: 'Build Amazing Websites Faster',
          subheading: 'Create beautiful, responsive websites with our intuitive visual builder. No coding required.',
          buttonText: 'Get Started Free',
          buttonUrl: '#signup'
        }
      },
      styles: {
        base: {
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '4rem 2rem',
          marginTop: '60px'
        }
      }
    },
    {
      id: generateId(),
      type: 'features',
      displayName: 'Features Section',
      props: {
        content: {
          heading: 'Why Choose Our Platform',
          features: [
            {
              title: 'Visual Builder',
              description: 'Drag and drop components to build your perfect website',
              icon: 'palette'
            },
            {
              title: 'Responsive Design',
              description: 'Looks great on all devices, from mobile to desktop',
              icon: 'devices'
            },
            {
              title: 'Fast Performance',
              description: 'Optimized code for lightning-fast load times',
              icon: 'zap'
            }
          ]
        }
      },
      styles: {
        base: {
          padding: '5rem 2rem',
          backgroundColor: '#f9fafb'
        }
      }
    },
    {
      id: generateId(),
      type: 'cta',
      displayName: 'Call to Action',
      props: {
        content: {
          heading: 'Ready to Get Started?',
          subheading: 'Join thousands of happy customers building amazing websites.',
          buttonText: 'Start Free Trial',
          buttonUrl: '#signup'
        }
      },
      styles: {
        base: {
          padding: '5rem 2rem',
          backgroundColor: '#4f46e5',
          color: 'white',
          textAlign: 'center'
        }
      }
    },
    {
      id: generateId(),
      type: 'footer',
      displayName: 'Footer',
      props: {
        content: {
          copyright: '© 2024 Your Company. All rights reserved.',
          links: [
            { text: 'Privacy', href: '#privacy' },
            { text: 'Terms', href: '#terms' },
            { text: 'Contact', href: '#contact' }
          ]
        }
      },
      styles: {
        base: {
          padding: '3rem 2rem',
          backgroundColor: '#1f2937',
          color: '#9ca3af',
          textAlign: 'center'
        }
      }
    }
  ]
};

const startupLandingTemplate: Template = {
  id: 'tpl_startup_landing',
  name: 'Startup Landing Page',
  category: 'landing',
  description: 'Bold and engaging landing page perfect for startups and SaaS products',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VmZjZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmI3MjgwIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+U3RhcnR1cCBMYW5kaW5nPC90ZXh0Pjwvc3ZnPg==',
  tags: ['startup', 'saas', 'bold', 'modern', 'conversion'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Hero Container',
      props: {},
      styles: {
        base: {
          background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)',
          minHeight: '100vh'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Hero Content',
          props: {},
          styles: {
            base: {
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '2rem'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Main Headline',
              props: {
                content: 'Launch Your Startup in Minutes',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '3.5rem',
                  fontWeight: '800',
                  color: '#0f172a',
                  marginBottom: '1.5rem',
                  lineHeight: '1.2'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Subheadline',
              props: {
                content: 'The fastest way to validate your idea and reach your first customers. No technical skills required.'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  color: '#64748b',
                  marginBottom: '2.5rem',
                  maxWidth: '600px'
                }
              }
            },
            {
              id: generateId(),
              type: 'flex',
              displayName: 'Button Group',
              props: {},
              styles: {
                base: {
                  gap: '1rem',
                  flexWrap: 'wrap'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Primary CTA',
                  props: {
                    content: 'Start Free Trial'
                  },
                  styles: {
                    base: {
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '0.75rem 2rem',
                      borderRadius: '0.5rem',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Secondary CTA',
                  props: {
                    content: 'Watch Demo'
                  },
                  styles: {
                    base: {
                      backgroundColor: 'transparent',
                      color: '#3b82f6',
                      padding: '0.75rem 2rem',
                      borderRadius: '0.5rem',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      border: '2px solid #3b82f6',
                      cursor: 'pointer'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const minimalistLandingTemplate: Template = {
  id: 'tpl_minimalist_landing',
  name: 'Minimalist Landing Page',
  category: 'landing',
  description: 'Clean and simple landing page with focus on content',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZmZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDAwMDAwIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+TWluaW1hbGlzdCBEZXNpZ248L3RleHQ+PC9zdmc+',
  tags: ['minimal', 'clean', 'simple', 'elegant'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Main Section',
      props: {},
      styles: {
        base: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: '2rem'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Content Container',
          props: {},
          styles: {
            base: {
              maxWidth: '800px',
              textAlign: 'center'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Title',
              props: {
                content: 'Less is More',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '4rem',
                  fontWeight: '300',
                  marginBottom: '2rem',
                  letterSpacing: '-0.02em'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Description',
              props: {
                content: 'Create beautiful experiences with minimal design. Focus on what truly matters.'
              },
              styles: {
                base: {
                  fontSize: '1.5rem',
                  color: '#666666',
                  marginBottom: '3rem',
                  lineHeight: '1.6'
                }
              }
            },
            {
              id: generateId(),
              type: 'button',
              displayName: 'CTA Button',
              props: {
                content: 'Explore'
              },
              styles: {
                base: {
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '1rem 3rem',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }
              }
            }
          ]
        }
      ]
    }
  ]
};

// Portfolio Templates
const creativePortfolioTemplate: Template = {
  id: 'tpl_creative_portfolio',
  name: 'Creative Portfolio',
  category: 'portfolio',
  description: 'Showcase your creative work with this modern portfolio layout',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZlZjNjNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTI0MDBhIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+Q3JlYXRpdmUgUG9ydGZvbGlvPC90ZXh0Pjwvc3ZnPg==',
  tags: ['portfolio', 'creative', 'gallery', 'modern', 'showcase'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Hero Section',
      props: {},
      styles: {
        base: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fef3c7',
          padding: '2rem'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Hero Content',
          props: {},
          styles: {
            base: {
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Name',
              props: {
                content: 'Jane Creative',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '5rem',
                  fontWeight: '700',
                  color: '#92400e',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Title',
              props: {
                content: 'Digital Designer & Creative Director'
              },
              styles: {
                base: {
                  fontSize: '1.5rem',
                  color: '#b45309',
                  marginBottom: '2rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Bio',
              props: {
                content: 'Crafting digital experiences that inspire and engage. Specializing in branding, UI/UX design, and creative direction.'
              },
              styles: {
                base: {
                  fontSize: '1.125rem',
                  color: '#92400e',
                  maxWidth: '600px',
                  lineHeight: '1.6'
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Portfolio Grid',
      props: {},
      styles: {
        base: {
          padding: '5rem 2rem',
          backgroundColor: 'white'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Grid Container',
          props: {},
          styles: {
            base: {
              maxWidth: '1200px',
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Section Title',
              props: {
                content: 'Selected Works',
                attributes: { level: '2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  marginBottom: '3rem',
                  textAlign: 'center'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Project Grid',
              props: {},
              styles: {
                base: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Project 1',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: '#f3f4f6',
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Project Title',
                      props: {
                        content: 'Project One'
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Project 2',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: '#f3f4f6',
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Project Title',
                      props: {
                        content: 'Project Two'
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Project 3',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: '#f3f4f6',
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Project Title',
                      props: {
                        content: 'Project Three'
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600'
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const photographerPortfolioTemplate: Template = {
  id: 'tpl_photographer_portfolio',
  name: 'Photographer Portfolio',
  category: 'portfolio',
  description: 'Elegant portfolio template for photographers and visual artists',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMDAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+UGhvdG9ncmFwaGVyPC90ZXh0Pjwvc3ZnPg==',
  tags: ['portfolio', 'photography', 'gallery', 'minimal', 'elegant'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Dark Hero',
      props: {},
      styles: {
        base: {
          minHeight: '100vh',
          backgroundColor: 'black',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Hero Content',
          props: {},
          styles: {
            base: {
              textAlign: 'center',
              zIndex: '10'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Studio Name',
              props: {
                content: 'STUDIO NOIR',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '4rem',
                  fontWeight: '300',
                  letterSpacing: '0.5em',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Tagline',
              props: {
                content: 'Capturing moments in monochrome'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  fontWeight: '300',
                  opacity: '0.8'
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Gallery',
      props: {},
      styles: {
        base: {
          backgroundColor: 'white',
          padding: '0'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'grid',
          displayName: 'Photo Grid',
          props: {},
          styles: {
            base: {
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2px'
            }
          },
          children: Array(6).fill(null).map((_, i) => ({
            id: generateId(),
            type: 'container',
            displayName: `Photo ${i + 1}`,
            props: {},
            styles: {
              base: {
                backgroundColor: i % 2 === 0 ? '#f3f4f6' : '#e5e7eb',
                aspectRatio: '1',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer'
              }
            },
            children: [
              {
                id: generateId(),
                type: 'image',
                displayName: 'Gallery Image',
                props: {
                  attributes: {
                    src: `https://via.placeholder.com/400x400/333/fff?text=Photo+${i + 1}`,
                    alt: `Gallery photo ${i + 1}`
                  }
                },
                styles: {
                  base: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s'
                  }
                }
              }
            ]
          }))
        }
      ]
    }
  ]
};

// DUPLICATE REMOVED - Using import from portfolioTemplates.ts instead
/*const developerPortfolioTemplate: Template = {
  id: 'tpl_developer_portfolio',
  name: 'Developer Portfolio',
  category: 'portfolio',
  description: 'Technical portfolio for developers and engineers',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMjMzMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNDBmZjgwIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0ibW9ub3NwYWNlIj4mZ3Q7XyBEZXZlbG9wZXI8L3RleHQ+PC9zdmc+',
  tags: ['portfolio', 'developer', 'technical', 'code', 'terminal'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Terminal Hero',
      props: {},
      styles: {
        base: {
          minHeight: '100vh',
          backgroundColor: '#1a2332',
          color: '#40ff80',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          padding: '2rem'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Terminal Window',
          props: {},
          styles: {
            base: {
              maxWidth: '800px',
              margin: '0 auto',
              backgroundColor: '#0d1117',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'text',
              displayName: 'Terminal Line 1',
              props: {
                content: '$ whoami'
              },
              styles: {
                base: {
                  fontSize: '1.125rem',
                  marginBottom: '0.5rem',
                  opacity: '0.8'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Name',
              props: {
                content: 'John Developer',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '2rem',
                  fontWeight: '400',
                  marginBottom: '1.5rem',
                  color: '#58a6ff'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Terminal Line 2',
              props: {
                content: '$ cat about.txt'
              },
              styles: {
                base: {
                  fontSize: '1.125rem',
                  marginBottom: '0.5rem',
                  opacity: '0.8'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'About',
              props: {
                content: 'Full-stack developer passionate about building scalable web applications. Specializing in React, Node.js, and cloud architecture.'
              },
              styles: {
                base: {
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                  color: '#8b949e'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Terminal Line 3',
              props: {
                content: '$ ls skills/'
              },
              styles: {
                base: {
                  fontSize: '1.125rem',
                  marginBottom: '0.5rem',
                  opacity: '0.8'
                }
              }
            },
            {
              id: generateId(),
              type: 'flex',
              displayName: 'Skills List',
              props: {},
              styles: {
                base: {
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.5rem'
                }
              },
              children: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS'].map(skill => ({
                id: generateId(),
                type: 'text',
                displayName: skill,
                props: {
                  content: skill
                },
                styles: {
                  base: {
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#21262d',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#58a6ff'
                  }
                }
              }))
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Cursor',
              props: {
                content: '$ █'
              },
              styles: {
                base: {
                  fontSize: '1.125rem',
                  animation: 'blink 1s infinite'
                }
              }
            }
          ]
        }
      ]
    }
  ]
};*/

// Blog Templates
const minimalBlogTemplate: Template = {
  id: 'tpl_minimal_blog',
  name: 'Minimal Blog',
  category: 'blog',
  description: 'Clean and focused blog layout for writers',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPjxsaW5lIHgxPSI1MCIgeTE9IjYwIiB4Mj0iMjUwIiB5Mj0iNjAiIHN0cm9rZT0iI2UzZTNlMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjUwIiB5MT0iODAiIHgyPSIyNTAiIHkyPSI4MCIgc3Ryb2tlPSIjZTNlM2UzIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iNTAiIHkxPSIxMDAiIHgyPSIyMDAiIHkyPSIxMDAiIHN0cm9rZT0iI2UzZTNlMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
  tags: ['blog', 'minimal', 'clean', 'writing', 'simple'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Blog Header',
      props: {},
      styles: {
        base: {
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '2rem 0'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Header Content',
          props: {},
          styles: {
            base: {
              maxWidth: '800px',
              margin: '0 auto',
              padding: '0 2rem',
              textAlign: 'center'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Blog Title',
              props: {
                content: 'The Minimal Blog',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Tagline',
              props: {
                content: 'Thoughts on design, code, and life'
              },
              styles: {
                base: {
                  fontSize: '1.125rem',
                  color: '#6b7280'
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Blog Posts',
      props: {},
      styles: {
        base: {
          backgroundColor: '#f9fafb',
          minHeight: '80vh',
          padding: '4rem 0'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Posts Container',
          props: {},
          styles: {
            base: {
              maxWidth: '800px',
              margin: '0 auto',
              padding: '0 2rem'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Blog Post 1',
              props: {},
              styles: {
                base: {
                  marginBottom: '4rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Post Title',
                  props: {
                    content: 'The Beauty of Simple Design',
                    attributes: { level: '2' }
                  },
                  styles: {
                    base: {
                      fontSize: '2rem',
                      fontWeight: '700',
                      marginBottom: '0.75rem',
                      color: '#111827'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Post Date',
                  props: {
                    content: 'January 15, 2024'
                  },
                  styles: {
                    base: {
                      fontSize: '0.875rem',
                      color: '#9ca3af',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Post Excerpt',
                  props: {
                    content: 'In a world filled with complexity, there\'s something profoundly satisfying about simple, well-crafted design. It\'s not about having less for the sake of it, but about having exactly what you need...'
                  },
                  styles: {
                    base: {
                      fontSize: '1.125rem',
                      lineHeight: '1.75',
                      color: '#4b5563',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'link',
                  displayName: 'Read More',
                  props: {
                    content: 'Read more →',
                    attributes: { href: '#' }
                  },
                  styles: {
                    base: {
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }
                  }
                }
              ]
            },
            {
              id: generateId(),
              type: 'container',
              displayName: 'Blog Post 2',
              props: {},
              styles: {
                base: {
                  marginBottom: '4rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Post Title',
                  props: {
                    content: 'Writing Code That Tells a Story',
                    attributes: { level: '2' }
                  },
                  styles: {
                    base: {
                      fontSize: '2rem',
                      fontWeight: '700',
                      marginBottom: '0.75rem',
                      color: '#111827'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Post Date',
                  props: {
                    content: 'January 10, 2024'
                  },
                  styles: {
                    base: {
                      fontSize: '0.875rem',
                      color: '#9ca3af',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Post Excerpt',
                  props: {
                    content: 'Good code is like good prose: clear, concise, and purposeful. Every line should have a reason to exist, every function should tell part of the story...'
                  },
                  styles: {
                    base: {
                      fontSize: '1.125rem',
                      lineHeight: '1.75',
                      color: '#4b5563',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'link',
                  displayName: 'Read More',
                  props: {
                    content: 'Read more →',
                    attributes: { href: '#' }
                  },
                  styles: {
                    base: {
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const magazineBlogTemplate: Template = {
  id: 'tpl_magazine_blog',
  name: 'Magazine Blog',
  category: 'blog',
  description: 'Rich magazine-style blog layout with featured posts',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VmNGQ0NCIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2ZmZiIgcng9IjQiLz48cmVjdCB4PSIxNjAiIHk9IjIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIiByeD0iNCIvPjxyZWN0IHg9IjIwIiB5PSIxMjAiIHdpZHRoPSIyNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmYiIHJ4PSI0Ii8+PC9zdmc+',
  tags: ['blog', 'magazine', 'news', 'featured', 'grid'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Magazine Header',
      props: {},
      styles: {
        base: {
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '3rem 0'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Header Container',
          props: {},
          styles: {
            base: {
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 2rem',
              textAlign: 'center'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Magazine Title',
              props: {
                content: 'THE DAILY DIGEST',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '3.5rem',
                  fontWeight: '800',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Date',
              props: {
                content: new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              },
              styles: {
                base: {
                  fontSize: '1.125rem',
                  opacity: '0.9'
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Featured Content',
      props: {},
      styles: {
        base: {
          padding: '4rem 0',
          backgroundColor: 'white'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Content Container',
          props: {},
          styles: {
            base: {
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 2rem'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Featured Grid',
              props: {},
              styles: {
                base: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem',
                  marginBottom: '3rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Featured Article 1',
                  props: {},
                  styles: {
                    base: {
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      overflow: 'hidden'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Image Placeholder',
                      props: {},
                      styles: {
                        base: {
                          height: '200px',
                          backgroundColor: '#f3f4f6'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Article Content',
                      props: {},
                      styles: {
                        base: {
                          padding: '1.5rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Category',
                          props: {
                            content: 'TECHNOLOGY'
                          },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              color: '#ef4444',
                              letterSpacing: '0.1em',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Article Title',
                          props: {
                            content: 'The Future of Modern Web Development',
                            attributes: { level: '3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.25rem',
                              fontWeight: '700',
                              marginBottom: '0.75rem',
                              color: '#111827'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Excerpt',
                          props: {
                            content: 'Exploring how artificial intelligence is reshaping the way we build and design websites...'
                          },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              color: '#6b7280',
                              lineHeight: '1.5'
                            }
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Featured Article 2',
                  props: {},
                  styles: {
                    base: {
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      overflow: 'hidden'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Image Placeholder',
                      props: {},
                      styles: {
                        base: {
                          height: '200px',
                          backgroundColor: '#f3f4f6'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Article Content',
                      props: {},
                      styles: {
                        base: {
                          padding: '1.5rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Category',
                          props: {
                            content: 'DESIGN'
                          },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              color: '#ef4444',
                              letterSpacing: '0.1em',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Article Title',
                          props: {
                            content: 'Minimalism: Less is More in 2024',
                            attributes: { level: '3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.25rem',
                              fontWeight: '700',
                              marginBottom: '0.75rem',
                              color: '#111827'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Excerpt',
                          props: {
                            content: 'Why the minimalist design movement continues to dominate modern web aesthetics...'
                          },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              color: '#6b7280',
                              lineHeight: '1.5'
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const personalBlogTemplate: Template = {
  id: 'tpl_personal_blog',
  name: 'Personal Blog',
  category: 'blog',
  description: 'Warm and inviting personal blog layout',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZlZjNjNyIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjgwIiByPSIzMCIgZmlsbD0iI2Y1OWUwYiIvPjxyZWN0IHg9IjUwIiB5PSIxMzAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAiIGZpbGw9IiNmNTllMGIiIHJ4PSI1Ii8+PHJlY3QgeD0iNzAiIHk9IjE1NSIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2Y1OWUwYiIgcng9IjUiLz48L3N2Zz4=',
  tags: ['blog', 'personal', 'warm', 'friendly', 'lifestyle'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Personal Header',
      props: {},
      styles: {
        base: {
          backgroundColor: '#fef3c7',
          padding: '4rem 0',
          textAlign: 'center'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Header Content',
          props: {},
          styles: {
            base: {
              maxWidth: '600px',
              margin: '0 auto',
              padding: '0 2rem'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Avatar',
              props: {},
              styles: {
                base: {
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b',
                  margin: '0 auto 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Initials',
                  props: {
                    content: 'JD'
                  },
                  styles: {
                    base: {
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      color: 'white'
                    }
                  }
                }
              ]
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Blog Name',
              props: {
                content: 'Journey & Discoveries',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#92400e',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Bio',
              props: {
                content: 'Hi! I\'m Jane, and this is where I share my thoughts on travel, creativity, and finding joy in the everyday moments.'
              },
              styles: {
                base: {
                  fontSize: '1.125rem',
                  color: '#b45309',
                  lineHeight: '1.6'
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Blog Content',
      props: {},
      styles: {
        base: {
          backgroundColor: 'white',
          padding: '4rem 0'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Posts Container',
          props: {},
          styles: {
            base: {
              maxWidth: '700px',
              margin: '0 auto',
              padding: '0 2rem'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Blog Post',
              props: {},
              styles: {
                base: {
                  marginBottom: '3rem',
                  padding: '2rem',
                  backgroundColor: '#fffbeb',
                  borderRadius: '0.5rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Post Title',
                  props: {
                    content: 'Finding Beauty in Morning Routines',
                    attributes: { level: '2' }
                  },
                  styles: {
                    base: {
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      color: '#92400e',
                      marginBottom: '0.5rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Date',
                  props: {
                    content: 'January 18, 2024'
                  },
                  styles: {
                    base: {
                      fontSize: '0.875rem',
                      color: '#d97706',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Post Content',
                  props: {
                    content: 'There\'s something magical about the quiet hours of the morning. The world feels softer, possibilities seem endless, and there\'s a special kind of peace that comes with watching the day slowly unfold...'
                  },
                  styles: {
                    base: {
                      fontSize: '1.125rem',
                      lineHeight: '1.75',
                      color: '#78350f'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Business Templates
const corporateBusinessTemplate: Template = {
  id: 'tpl_corporate_business',
  name: 'Corporate Business',
  category: 'business',
  description: 'Professional corporate website template',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFmMjkzNyIvPjxyZWN0IHg9IjMwIiB5PSIzMCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzMxNDc2YyIgcng9IjQiLz48cmVjdCB4PSIzMCIgeT0iMTEwIiB3aWR0aD0iMTEwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNDc1NTY5IiByeD0iNCIvPjxyZWN0IHg9IjE2MCIgeT0iMTEwIiB3aWR0aD0iMTEwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNDc1NTY5IiByeD0iNCIvPjwvc3ZnPg==',
  tags: ['business', 'corporate', 'professional', 'services', 'enterprise'],
  components: [
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Corporate Nav',
      props: {
        content: {
          logo: 'CORPTECH',
          links: [
            { text: 'About', href: '#about' },
            { text: 'Services', href: '#services' },
            { text: 'Solutions', href: '#solutions' },
            { text: 'Contact', href: '#contact' }
          ]
        }
      },
      styles: {
        base: {
          backgroundColor: '#1f2937',
          padding: '1rem 0',
          position: 'sticky',
          top: '0',
          zIndex: '100'
        }
      }
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Corporate Hero',
      props: {},
      styles: {
        base: {
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '6rem 2rem',
          textAlign: 'center'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Hero Content',
          props: {},
          styles: {
            base: {
              maxWidth: '800px',
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Main Headline',
              props: {
                content: 'Innovative Solutions for Modern Business',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '700',
                  marginBottom: '1.5rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Subheadline',
              props: {
                content: 'We deliver cutting-edge technology solutions that drive growth and transform enterprises worldwide.'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  marginBottom: '2rem',
                  opacity: '0.9'
                }
              }
            },
            {
              id: generateId(),
              type: 'button',
              displayName: 'CTA',
              props: {
                content: 'Get Started'
              },
              styles: {
                base: {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Services Section',
      props: {},
      styles: {
        base: {
          padding: '5rem 2rem',
          backgroundColor: '#f9fafb'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Services Container',
          props: {},
          styles: {
            base: {
              maxWidth: '1200px',
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Section Title',
              props: {
                content: 'Our Services',
                attributes: { level: '2' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: '3rem',
                  color: '#1f2937'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Services Grid',
              props: {},
              styles: {
                base: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Service Card 1',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      padding: '2rem',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Service Title',
                      props: {
                        content: 'Cloud Solutions',
                        attributes: { level: '3' }
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          marginBottom: '1rem',
                          color: '#1f2937'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Service Description',
                      props: {
                        content: 'Scalable cloud infrastructure and migration services to modernize your business operations.'
                      },
                      styles: {
                        base: {
                          color: '#6b7280',
                          lineHeight: '1.6'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Service Card 2',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      padding: '2rem',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Service Title',
                      props: {
                        content: 'Digital Transformation',
                        attributes: { level: '3' }
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          marginBottom: '1rem',
                          color: '#1f2937'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Service Description',
                      props: {
                        content: 'End-to-end digital transformation strategies to revolutionize your business processes.'
                      },
                      styles: {
                        base: {
                          color: '#6b7280',
                          lineHeight: '1.6'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Service Card 3',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      padding: '2rem',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Service Title',
                      props: {
                        content: 'Cybersecurity',
                        attributes: { level: '3' }
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          marginBottom: '1rem',
                          color: '#1f2937'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Service Description',
                      props: {
                        content: 'Advanced security solutions to protect your data and ensure business continuity.'
                      },
                      styles: {
                        base: {
                          color: '#6b7280',
                          lineHeight: '1.6'
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const consultingBusinessTemplate: Template = {
  id: 'tpl_consulting_business',
  name: 'Consulting Agency',
  category: 'business',
  description: 'Modern consulting and agency website template',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ViZjhmZiIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiMzYjgyZjYiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjEwMCIgcj0iMzAiIGZpbGw9IiM2MGE1ZmEiLz48Y2lyY2xlIGN4PSIyMjAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSIjNjBhNWZhIi8+PC9zdmc+',
  tags: ['business', 'consulting', 'agency', 'modern', 'professional'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Consulting Hero',
      props: {},
      styles: {
        base: {
          background: 'linear-gradient(135deg, #ebf8ff 0%, #dbeafe 100%)',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          padding: '2rem'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Hero Container',
          props: {},
          styles: {
            base: {
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'center'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Left Content',
              props: {},
              styles: {
                base: {}
              },
              children: [
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Headline',
                  props: {
                    content: 'Strategic Consulting for Growth',
                    attributes: { level: '1' }
                  },
                  styles: {
                    base: {
                      fontSize: '3.5rem',
                      fontWeight: '800',
                      color: '#1e40af',
                      marginBottom: '1.5rem',
                      lineHeight: '1.1'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Description',
                  props: {
                    content: 'We partner with ambitious companies to unlock their potential and accelerate sustainable growth through data-driven strategies.'
                  },
                  styles: {
                    base: {
                      fontSize: '1.25rem',
                      color: '#64748b',
                      marginBottom: '2rem',
                      lineHeight: '1.6'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'flex',
                  displayName: 'CTA Buttons',
                  props: {},
                  styles: {
                    base: {
                      gap: '1rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'button',
                      displayName: 'Primary CTA',
                      props: {
                        content: 'Schedule Consultation'
                      },
                      styles: {
                        base: {
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          padding: '1rem 2rem',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'button',
                      displayName: 'Secondary CTA',
                      props: {
                        content: 'View Case Studies'
                      },
                      styles: {
                        base: {
                          backgroundColor: 'transparent',
                          color: '#3b82f6',
                          padding: '1rem 2rem',
                          border: '2px solid #3b82f6',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: generateId(),
              type: 'container',
              displayName: 'Right Visual',
              props: {},
              styles: {
                base: {
                  position: 'relative'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Circle 1',
                  props: {},
                  styles: {
                    base: {
                      width: '300px',
                      height: '300px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      opacity: '0.1'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Circle 2',
                  props: {},
                  styles: {
                    base: {
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      backgroundColor: '#60a5fa',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      opacity: '0.2'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Circle 3',
                  props: {},
                  styles: {
                    base: {
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const startupBusinessTemplate: Template = {
  id: 'tpl_startup_business',
  name: 'Tech Startup',
  category: 'business',
  description: 'Modern tech startup website with gradients',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOGI1Y2Y2O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjNDg5OTtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNncmFkMSkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI2MDAiPlRlY2ggU3RhcnR1cDwvdGV4dD48L3N2Zz4=',
  tags: ['business', 'startup', 'tech', 'gradient', 'modern'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Gradient Hero',
      props: {},
      styles: {
        base: {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Content',
          props: {},
          styles: {
            base: {
              textAlign: 'center',
              zIndex: '10',
              maxWidth: '800px',
              padding: '2rem'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'text',
              displayName: 'Badge',
              props: {
                content: '🚀 NOW IN BETA'
              },
              styles: {
                base: {
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '2rem',
                  fontSize: '0.875rem',
                  marginBottom: '2rem',
                  backdropFilter: 'blur(10px)'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Main Headline',
              props: {
                content: 'The Future of Work is Here',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '4rem',
                  fontWeight: '800',
                  marginBottom: '1.5rem',
                  lineHeight: '1.1'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Subheadline',
              props: {
                content: 'Revolutionary productivity tools that transform how teams collaborate and innovate.'
              },
              styles: {
                base: {
                  fontSize: '1.5rem',
                  marginBottom: '3rem',
                  opacity: '0.9',
                  maxWidth: '600px',
                  margin: '0 auto 3rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'button',
              displayName: 'CTA',
              props: {
                content: 'Get Early Access'
              },
              styles: {
                base: {
                  backgroundColor: 'white',
                  color: '#8b5cf6',
                  padding: '1rem 3rem',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '3rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }
              }
            }
          ]
        },
        {
          id: generateId(),
          type: 'container',
          displayName: 'Background Decoration',
          props: {},
          styles: {
            base: {
              position: 'absolute',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              top: '-250px',
              right: '-250px'
            }
          }
        }
      ]
    }
  ]
};

// E-commerce Templates
const modernEcommerceTemplate: Template = {
  id: 'tpl_modern_ecommerce',
  name: 'Modern Store',
  category: 'ecommerce',
  description: 'Clean e-commerce layout with product grid',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZTVlN2ViIiByeD0iOCIvPjxyZWN0IHg9IjExMCIgeT0iMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2U1ZTdlYiIgcng9IjgiLz48cmVjdCB4PSIyMDAiIHk9IjIwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNlNWU3ZWIiIHJ4PSI4Ii8+PHJlY3QgeD0iMjAiIHk9IjExMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZTVlN2ViIiByeD0iOCIvPjxyZWN0IHg9IjExMCIgeT0iMTEwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNlNWU3ZWIiIHJ4PSI4Ii8+PHJlY3QgeD0iMjAwIiB5PSIxMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2U1ZTdlYiIgcng9IjgiLz48L3N2Zz4=',
  tags: ['ecommerce', 'store', 'shop', 'products', 'modern'],
  components: [
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Store Navigation',
      props: {
        content: {
          logo: 'MODERN STORE',
          links: [
            { text: 'Shop', href: '#shop' },
            { text: 'Collections', href: '#collections' },
            { text: 'About', href: '#about' },
            { text: 'Cart (0)', href: '#cart' }
          ]
        }
      },
      styles: {
        base: {
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0',
          position: 'sticky',
          top: '0',
          zIndex: '100'
        }
      }
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Hero Banner',
      props: {},
      styles: {
        base: {
          backgroundColor: '#f3f4f6',
          padding: '4rem 2rem',
          textAlign: 'center'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'heading',
          displayName: 'Sale Headline',
          props: {
            content: 'Summer Collection Sale',
            attributes: { level: '1' }
          },
          styles: {
            base: {
              fontSize: '3rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#111827'
            }
          }
        },
        {
          id: generateId(),
          type: 'text',
          displayName: 'Sale Text',
          props: {
            content: 'Up to 50% off on selected items. Limited time offer!'
          },
          styles: {
            base: {
              fontSize: '1.25rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }
          }
        },
        {
          id: generateId(),
          type: 'button',
          displayName: 'Shop Button',
          props: {
            content: 'Shop Now'
          },
          styles: {
            base: {
              backgroundColor: '#111827',
              color: 'white',
              padding: '1rem 2.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }
          }
        }
      ]
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Products Section',
      props: {},
      styles: {
        base: {
          padding: '4rem 2rem'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Products Container',
          props: {},
          styles: {
            base: {
              maxWidth: '1200px',
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Section Title',
              props: {
                content: 'Featured Products',
                attributes: { level: '2' }
              },
              styles: {
                base: {
                  fontSize: '2rem',
                  fontWeight: '700',
                  marginBottom: '3rem',
                  textAlign: 'center'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Product Grid',
              props: {},
              styles: {
                base: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '2rem'
                }
              },
              children: Array(6).fill(null).map((_, i) => ({
                id: generateId(),
                type: 'container',
                displayName: `Product ${i + 1}`,
                props: {},
                styles: {
                  base: {
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }
                },
                children: [
                  {
                    id: generateId(),
                    type: 'container',
                    displayName: 'Product Image',
                    props: {},
                    styles: {
                      base: {
                        height: '300px',
                        backgroundColor: '#e5e7eb'
                      }
                    }
                  },
                  {
                    id: generateId(),
                    type: 'container',
                    displayName: 'Product Info',
                    props: {},
                    styles: {
                      base: {
                        padding: '1.5rem'
                      }
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'heading',
                        displayName: 'Product Name',
                        props: {
                          content: `Product ${i + 1}`,
                          attributes: { level: '3' }
                        },
                        styles: {
                          base: {
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem'
                          }
                        }
                      },
                      {
                        id: generateId(),
                        type: 'text',
                        displayName: 'Price',
                        props: {
                          content: '$99.00'
                        },
                        styles: {
                          base: {
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#111827'
                          }
                        }
                      }
                    ]
                  }
                ]
              }))
            }
          ]
        }
      ]
    }
  ]
};

const fashionEcommerceTemplate: Template = {
  id: 'tpl_fashion_ecommerce',
  name: 'Fashion Store',
  category: 'ecommerce',
  description: 'Elegant fashion e-commerce template',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZmJmMCIvPjxyZWN0IHg9IjUwIiB5PSI0MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmZGU2OGEiIHJ4PSI0Ii8+PHRleHQgeD0iMTUwIiB5PSIxMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zdHlsZT0iaXRhbGljIj5GYXNoaW9uPC90ZXh0Pjwvc3ZnPg==',
  tags: ['ecommerce', 'fashion', 'clothing', 'elegant', 'luxury'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Fashion Hero',
      props: {},
      styles: {
        base: {
          minHeight: '100vh',
          backgroundColor: '#fffbf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Hero Content',
          props: {},
          styles: {
            base: {
              textAlign: 'center',
              maxWidth: '800px',
              padding: '2rem'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Brand Name',
              props: {
                content: 'ELEGANCE',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '5rem',
                  fontWeight: '300',
                  letterSpacing: '0.3em',
                  marginBottom: '1rem',
                  fontFamily: 'serif'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Tagline',
              props: {
                content: 'Timeless Fashion for the Modern Woman'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  fontStyle: 'italic',
                  color: '#666',
                  marginBottom: '3rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'flex',
              displayName: 'CTA Group',
              props: {},
              styles: {
                base: {
                  gap: '2rem',
                  justifyContent: 'center'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Shop Women',
                  props: {
                    content: 'SHOP WOMEN'
                  },
                  styles: {
                    base: {
                      backgroundColor: 'black',
                      color: 'white',
                      padding: '1rem 3rem',
                      border: 'none',
                      letterSpacing: '0.1em',
                      cursor: 'pointer'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Shop Men',
                  props: {
                    content: 'SHOP MEN'
                  },
                  styles: {
                    base: {
                      backgroundColor: 'transparent',
                      color: 'black',
                      padding: '1rem 3rem',
                      border: '2px solid black',
                      letterSpacing: '0.1em',
                      cursor: 'pointer'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const minimalEcommerceTemplate: Template = {
  id: 'tpl_minimal_ecommerce',
  name: 'Minimal Shop',
  category: 'ecommerce',
  description: 'Ultra-minimal e-commerce design',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxsaW5lIHgxPSIwIiB5MT0iMTAwIiB4Mj0iMzAwIiB5Mj0iMTAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjxsaW5lIHgxPSIxNTAiIHkxPSIwIiB4Mj0iMTUwIiB5Mj0iMjAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==',
  tags: ['ecommerce', 'minimal', 'simple', 'clean', 'modern'],
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Minimal Layout',
      props: {},
      styles: {
        base: {
          minHeight: '100vh',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Header',
          props: {},
          styles: {
            base: {
              padding: '2rem',
              borderBottom: '1px solid black',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Logo',
              props: {
                content: 'MINIMAL',
                attributes: { level: '1' }
              },
              styles: {
                base: {
                  fontSize: '1.5rem',
                  fontWeight: '400',
                  letterSpacing: '0.2em'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Cart',
              props: {
                content: 'CART (0)'
              },
              styles: {
                base: {
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em'
                }
              }
            }
          ]
        },
        {
          id: generateId(),
          type: 'grid',
          displayName: 'Product Grid',
          props: {},
          styles: {
            base: {
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              flex: '1'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Product 1',
              props: {},
              styles: {
                base: {
                  borderRight: '1px solid black',
                  borderBottom: '1px solid black',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Product Image',
                  props: {},
                  styles: {
                    base: {
                      aspectRatio: '1',
                      backgroundColor: '#f5f5f5',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Product Name',
                  props: {
                    content: 'PRODUCT ONE'
                  },
                  styles: {
                    base: {
                      fontSize: '0.875rem',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Price',
                  props: {
                    content: '$100'
                  },
                  styles: {
                    base: {
                      fontSize: '0.875rem'
                    }
                  }
                }
              ]
            },
            {
              id: generateId(),
              type: 'container',
              displayName: 'Product 2',
              props: {},
              styles: {
                base: {
                  borderBottom: '1px solid black',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Product Image',
                  props: {},
                  styles: {
                    base: {
                      aspectRatio: '1',
                      backgroundColor: '#f5f5f5',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Product Name',
                  props: {
                    content: 'PRODUCT TWO'
                  },
                  styles: {
                    base: {
                      fontSize: '0.875rem',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Price',
                  props: {
                    content: '$120'
                  },
                  styles: {
                    base: {
                      fontSize: '0.875rem'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Export all templates
export const templates: Template[] = [
  // Modern Templates (Featured)
  modernStartupTemplate,
  professionalAgencyTemplate,

  // Landing Pages
  saasLandingTemplate,
  productLaunchTemplate,
  agencyLandingTemplate,

  // Portfolio
  designerPortfolioTemplate,
  developerPortfolioTemplate,
  photographerPortfolioTemplate,

  // Blog
  techBlogTemplate,
  personalBlogTemplate,
  magazineBlogTemplate,

  // E-commerce
  ecommerceTemplate
];