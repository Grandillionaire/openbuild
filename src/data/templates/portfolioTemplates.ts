import type { Template } from '@/types/template';
import { nanoid } from 'nanoid';

// Helper function to generate IDs
function generateId() {
  return nanoid(8);
}

// Designer Portfolio Template
export const designerPortfolioTemplate: Template = {
  id: 'tpl_designer_portfolio',
  name: 'Designer Portfolio',
  category: 'portfolio',
  description: 'Minimal and elegant portfolio for designers and creatives',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHg9IjIwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2UyZThmMCIgcng9IjQiLz48cmVjdCB4PSIxNjAiIHk9IjYwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZTJlOGYwIiByeD0iNCIvPjxsaW5lIHgxPSIyMCIgeTE9IjMwIiB4Mj0iMTAwIiB5Mj0iMzAiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
  tags: ['portfolio', 'minimal', 'designer', 'clean', 'gallery'],
  isPremium: false,
  components: [
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Navigation',
      props: {
        content: {
          logo: 'Jane Doe',
          links: [
            { text: 'Work', href: '#work' },
            { text: 'About', href: '#about' },
            { text: 'Contact', href: '#contact' }
          ]
        }
      },
      styles: {
        base: {
          position: 'fixed',
          top: '0',
          width: '100%',
          backgroundColor: 'transparent',
          zIndex: '100',
          padding: '2rem 0',
          transition: 'all 0.3s'
        }
      }
    },
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
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          padding: '0 2rem'
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
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Main Title',
              props: {
                content: 'Hi, I\'m Jane Doe',
                attributes: { level: 'h1' }
              },
              styles: {
                base: {
                  fontSize: '3.5rem',
                  fontWeight: '300',
                  marginBottom: '1rem',
                  color: '#1f2937',
                  letterSpacing: '-0.02em'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Subtitle',
              props: {
                content: 'Product Designer & Creative Director based in San Francisco'
              },
              styles: {
                base: {
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  fontWeight: '300',
                  marginBottom: '3rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'flex',
              displayName: 'Social Links',
              props: {},
              styles: {
                base: {
                  justifyContent: 'center',
                  gap: '2rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'link',
                  displayName: 'Dribbble',
                  props: {
                    content: 'Dribbble',
                    attributes: { href: '#', target: '_blank' }
                  },
                  styles: {
                    base: {
                      color: '#6b7280',
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'link',
                  displayName: 'LinkedIn',
                  props: {
                    content: 'LinkedIn',
                    attributes: { href: '#', target: '_blank' }
                  },
                  styles: {
                    base: {
                      color: '#6b7280',
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'link',
                  displayName: 'Instagram',
                  props: {
                    content: 'Instagram',
                    attributes: { href: '#', target: '_blank' }
                  },
                  styles: {
                    base: {
                      color: '#6b7280',
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }
                  }
                }
              ]
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
          type: 'heading',
          displayName: 'Section Title',
          props: {
            content: 'Selected Work',
            attributes: { level: 'h2' }
          },
          styles: {
            base: {
              fontSize: '2.5rem',
              fontWeight: '300',
              textAlign: 'center',
              marginBottom: '4rem',
              color: '#1f2937'
            }
          }
        },
        {
          id: generateId(),
          type: 'grid',
          displayName: 'Project Grid',
          props: {
            content: { columns: 2, gap: '3rem' }
          },
          styles: {
            base: {
              maxWidth: '1200px',
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Project Card',
              props: {},
              styles: {
                base: {
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'image',
                  displayName: 'Project Image',
                  props: {
                    attributes: {
                      src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
                      alt: 'Mobile App Design'
                    }
                  },
                  styles: {
                    base: {
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Project Info',
                  props: {},
                  styles: {
                    base: {
                      padding: '2rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Project Title',
                      props: {
                        content: 'Finance App Redesign',
                        attributes: { level: 'h3' }
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                          color: '#1f2937'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Project Category',
                      props: {
                        content: 'Mobile Design • UI/UX'
                      },
                      styles: {
                        base: {
                          color: '#6b7280',
                          fontSize: '0.875rem'
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
              displayName: 'Project Card',
              props: {},
              styles: {
                base: {
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'image',
                  displayName: 'Project Image',
                  props: {
                    attributes: {
                      src: 'https://images.unsplash.com/photo-1586717791821-3f44a563c4dc?w=800&h=600&fit=crop',
                      alt: 'Brand Identity'
                    }
                  },
                  styles: {
                    base: {
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Project Info',
                  props: {},
                  styles: {
                    base: {
                      padding: '2rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Project Title',
                      props: {
                        content: 'Startup Brand Identity',
                        attributes: { level: 'h3' }
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                          color: '#1f2937'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Project Category',
                      props: {
                        content: 'Branding • Visual Design'
                      },
                      styles: {
                        base: {
                          color: '#6b7280',
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
    },
    // Skills Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Skills Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          backgroundColor: '#ffffff'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Skills Container',
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
                content: 'Skills & Expertise',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '300',
                  textAlign: 'center',
                  marginBottom: '3rem',
                  color: '#1f2937'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Skills Grid',
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
                  displayName: 'Skill Item',
                  props: {},
                  styles: {
                    base: {
                      padding: '1.5rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Skill Header',
                      props: {},
                      styles: {
                        base: {
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.75rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Name',
                          props: { content: 'UI/UX Design' },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '500',
                              color: '#374151'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Level',
                          props: { content: '95%' },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#8B5CF6'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Progress Bar Background',
                      props: {},
                      styles: {
                        base: {
                          width: '100%',
                          height: '4px',
                          backgroundColor: '#E5E7EB',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Progress Bar Fill',
                          props: {},
                          styles: {
                            base: {
                              width: '95%',
                              height: '100%',
                              backgroundColor: '#8B5CF6',
                              borderRadius: '2px',
                              transition: 'width 1s ease-out'
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
                  displayName: 'Skill Item',
                  props: {},
                  styles: {
                    base: {
                      padding: '1.5rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Skill Header',
                      props: {},
                      styles: {
                        base: {
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.75rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Name',
                          props: { content: 'Brand Strategy' },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '500',
                              color: '#374151'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Level',
                          props: { content: '90%' },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#8B5CF6'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Progress Bar Background',
                      props: {},
                      styles: {
                        base: {
                          width: '100%',
                          height: '4px',
                          backgroundColor: '#E5E7EB',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Progress Bar Fill',
                          props: {},
                          styles: {
                            base: {
                              width: '90%',
                              height: '100%',
                              backgroundColor: '#8B5CF6',
                              borderRadius: '2px',
                              transition: 'width 1s ease-out'
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
                  displayName: 'Skill Item',
                  props: {},
                  styles: {
                    base: {
                      padding: '1.5rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Skill Header',
                      props: {},
                      styles: {
                        base: {
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.75rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Name',
                          props: { content: 'Motion Design' },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '500',
                              color: '#374151'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Level',
                          props: { content: '85%' },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#8B5CF6'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Progress Bar Background',
                      props: {},
                      styles: {
                        base: {
                          width: '100%',
                          height: '4px',
                          backgroundColor: '#E5E7EB',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Progress Bar Fill',
                          props: {},
                          styles: {
                            base: {
                              width: '85%',
                              height: '100%',
                              backgroundColor: '#8B5CF6',
                              borderRadius: '2px',
                              transition: 'width 1s ease-out'
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
                  displayName: 'Skill Item',
                  props: {},
                  styles: {
                    base: {
                      padding: '1.5rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Skill Header',
                      props: {},
                      styles: {
                        base: {
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.75rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Name',
                          props: { content: 'Figma & Sketch' },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '500',
                              color: '#374151'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Level',
                          props: { content: '100%' },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#8B5CF6'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Progress Bar Background',
                      props: {},
                      styles: {
                        base: {
                          width: '100%',
                          height: '4px',
                          backgroundColor: '#E5E7EB',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Progress Bar Fill',
                          props: {},
                          styles: {
                            base: {
                              width: '100%',
                              height: '100%',
                              backgroundColor: '#8B5CF6',
                              borderRadius: '2px',
                              transition: 'width 1s ease-out'
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
                  displayName: 'Skill Item',
                  props: {},
                  styles: {
                    base: {
                      padding: '1.5rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Skill Header',
                      props: {},
                      styles: {
                        base: {
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.75rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Name',
                          props: { content: 'Illustration' },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '500',
                              color: '#374151'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Level',
                          props: { content: '88%' },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#8B5CF6'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Progress Bar Background',
                      props: {},
                      styles: {
                        base: {
                          width: '100%',
                          height: '4px',
                          backgroundColor: '#E5E7EB',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Progress Bar Fill',
                          props: {},
                          styles: {
                            base: {
                              width: '88%',
                              height: '100%',
                              backgroundColor: '#8B5CF6',
                              borderRadius: '2px',
                              transition: 'width 1s ease-out'
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
                  displayName: 'Skill Item',
                  props: {},
                  styles: {
                    base: {
                      padding: '1.5rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Skill Header',
                      props: {},
                      styles: {
                        base: {
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.75rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Name',
                          props: { content: 'Typography' },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '500',
                              color: '#374151'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Skill Level',
                          props: { content: '92%' },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#8B5CF6'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Progress Bar Background',
                      props: {},
                      styles: {
                        base: {
                          width: '100%',
                          height: '4px',
                          backgroundColor: '#E5E7EB',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Progress Bar Fill',
                          props: {},
                          styles: {
                            base: {
                              width: '92%',
                              height: '100%',
                              backgroundColor: '#8B5CF6',
                              borderRadius: '2px',
                              transition: 'width 1s ease-out'
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
    },
    // Client Testimonials
    {
      id: generateId(),
      type: 'section',
      displayName: 'Testimonials Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          backgroundColor: '#f9fafb'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Testimonials Container',
          props: {},
          styles: {
            base: {
              maxWidth: '1000px',
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Section Title',
              props: {
                content: 'Client Testimonials',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '300',
                  textAlign: 'center',
                  marginBottom: '3rem',
                  color: '#1f2937'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Testimonials Grid',
              props: {},
              styles: {
                base: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '2rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Testimonial Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      padding: '2rem',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Testimonial Text',
                      props: {
                        content: '"Jane transformed our brand identity with her exceptional creative vision. Her attention to detail and ability to understand our needs was outstanding."'
                      },
                      styles: {
                        base: {
                          fontSize: '1rem',
                          color: '#374151',
                          lineHeight: '1.8',
                          marginBottom: '1.5rem',
                          fontStyle: 'italic'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Client Info',
                      props: {},
                      styles: {
                        base: {
                          alignItems: 'center',
                          gap: '1rem'
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
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Client Details',
                          props: {},
                          styles: {
                            base: {}
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Name',
                              props: { content: 'Alex Thompson' },
                              styles: {
                                base: {
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  color: '#111827',
                                  marginBottom: '0.25rem'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Role',
                              props: { content: 'CEO, TechStart Inc.' },
                              styles: {
                                base: {
                                  fontSize: '0.875rem',
                                  color: '#6B7280'
                                }
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Testimonial Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      padding: '2rem',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Testimonial Text',
                      props: {
                        content: '"Working with Jane was a game-changer for our startup. Her designs helped us secure funding and establish a strong market presence."'
                      },
                      styles: {
                        base: {
                          fontSize: '1rem',
                          color: '#374151',
                          lineHeight: '1.8',
                          marginBottom: '1.5rem',
                          fontStyle: 'italic'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Client Info',
                      props: {},
                      styles: {
                        base: {
                          alignItems: 'center',
                          gap: '1rem'
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
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Client Details',
                          props: {},
                          styles: {
                            base: {}
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Name',
                              props: { content: 'Sarah Mitchell' },
                              styles: {
                                base: {
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  color: '#111827',
                                  marginBottom: '0.25rem'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Role',
                              props: { content: 'Founder, Creative Labs' },
                              styles: {
                                base: {
                                  fontSize: '0.875rem',
                                  color: '#6B7280'
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
    },
    // Contact CTA
    {
      id: generateId(),
      type: 'section',
      displayName: 'Contact CTA',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textAlign: 'center'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'CTA Container',
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
              displayName: 'CTA Title',
              props: {
                content: "Let's Create Something Beautiful",
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '300',
                  color: 'white',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'CTA Description',
              props: {
                content: "Have a project in mind? I'd love to hear about it and explore how we can work together."
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '2rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'button',
              displayName: 'CTA Button',
              props: {
                content: 'Start a Project'
              },
              styles: {
                base: {
                  padding: '1rem 2.5rem',
                  backgroundColor: 'white',
                  color: '#667eea',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                }
              }
            }
          ]
        }
      ]
    },
    // Footer
    {
      id: generateId(),
      type: 'footer',
      displayName: 'Footer',
      props: {
        content: {
          links: ['Work', 'About', 'Contact', 'Instagram', 'Dribbble', 'LinkedIn'],
          copyright: '© 2024 Jane Doe. All rights reserved.'
        }
      },
      styles: {
        base: {
          backgroundColor: '#f9fafb',
          padding: '4rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb'
        }
      }
    }
  ]
};

// Developer Portfolio Template
export const developerPortfolioTemplate: Template = {
  id: 'tpl_developer_portfolio',
  name: 'Developer Portfolio',
  category: 'portfolio',
  description: 'Tech-focused portfolio with terminal aesthetic for developers',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjIwIiB5PSI0MCIgZmlsbD0iIzAwZmYwMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCI+JCBfPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI2MCIgZmlsbD0iIzAwZmYwMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiI+cG9ydGZvbGlvLmpzPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI4MCIgZmlsbD0iIzAwZmYwMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiI+cHJvamVjdHMvPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSIxMDAiIGZpbGw9IiMwMGZmMDAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiPnNraWxscy50eHQ8L3RleHQ+PC9zdmc+',
  tags: ['portfolio', 'developer', 'terminal', 'dark', 'tech'],
  isPremium: false,
  components: [
    // Navigation with terminal style
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Terminal Navigation',
      props: {
        content: {
          logo: '~/john.dev',
          links: [
            { text: 'about', href: '#about' },
            { text: 'projects', href: '#projects' },
            { text: 'skills', href: '#skills' },
            { text: 'contact', href: '#contact' }
          ]
        }
      },
      styles: {
        base: {
          position: 'fixed',
          top: '0',
          width: '100%',
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #333',
          zIndex: '1000',
          padding: '1rem 0',
          color: '#00ff00'
        }
      }
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Terminal Section',
      props: {},
      styles: {
        base: {
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          padding: '6rem 2rem 2rem'
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
              maxWidth: '900px',
              margin: '0 auto',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Terminal Header',
              props: {},
              styles: {
                base: {
                  backgroundColor: '#2d2d2d',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #444'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Terminal Title',
                  props: {
                    content: 'developer@portfolio:~$'
                  },
                  styles: {
                    base: {
                      color: '#999',
                      fontSize: '0.875rem'
                    }
                  }
                }
              ]
            },
            {
              id: generateId(),
              type: 'container',
              displayName: 'Terminal Content',
              props: {},
              styles: {
                base: {
                  padding: '2rem',
                  minHeight: '500px'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Command',
                  props: {
                    content: '$ cat about.md',
                    animations: [{
                      id: generateId(),
                      name: 'Typewriter Effect',
                      trigger: 'onLoad',
                      timeline: [
                        { time: 0, properties: { opacity: 0 } },
                        { time: 0.5, properties: { opacity: 1 } }
                      ],
                      options: {
                        duration: 500,
                        delay: 100,
                        easing: 'steps(1)'
                      }
                    }]
                  },
                  styles: {
                    base: {
                      color: '#00ff00',
                      fontSize: '1rem',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Name',
                  props: {
                    content: '# John Doe',
                    attributes: { level: 'h1' }
                  },
                  styles: {
                    base: {
                      color: '#fff',
                      fontSize: '2.5rem',
                      marginBottom: '0.5rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Title',
                  props: {
                    content: '> Full Stack Developer | Open Source Enthusiast'
                  },
                  styles: {
                    base: {
                      color: '#00ff00',
                      fontSize: '1.25rem',
                      marginBottom: '2rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'About',
                  props: {
                    content: 'Building scalable web applications with modern technologies. Passionate about clean code, performance optimization, and developer experience.'
                  },
                  styles: {
                    base: {
                      color: '#ccc',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      marginBottom: '2rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Skills Command',
                  props: {
                    content: '$ ls -la skills/'
                  },
                  styles: {
                    base: {
                      color: '#00ff00',
                      fontSize: '1rem',
                      marginBottom: '0.5rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Skills List',
                  props: {},
                  styles: {
                    base: {
                      marginBottom: '2rem',
                      paddingLeft: '1rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Frontend Skills',
                      props: {
                        content: 'drwxr-xr-x  frontend/    JavaScript, TypeScript, React, Vue'
                      },
                      styles: {
                        base: {
                          color: '#61dafb',
                          fontSize: '0.875rem',
                          marginBottom: '0.25rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Backend Skills',
                      props: {
                        content: 'drwxr-xr-x  backend/     Node.js, Python, PostgreSQL, Redis'
                      },
                      styles: {
                        base: {
                          color: '#68a063',
                          fontSize: '0.875rem',
                          marginBottom: '0.25rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'DevOps Skills',
                      props: {
                        content: 'drwxr-xr-x  devops/      Docker, K8s, AWS, CI/CD'
                      },
                      styles: {
                        base: {
                          color: '#ff9900',
                          fontSize: '0.875rem'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Contact Command',
                  props: {
                    content: '$ echo $CONTACT'
                  },
                  styles: {
                    base: {
                      color: '#00ff00',
                      fontSize: '1rem',
                      marginBottom: '0.5rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Contact Info',
                  props: {
                    content: 'github.com/johndoe | linkedin.com/in/johndoe | john@example.com'
                  },
                  styles: {
                    base: {
                      color: '#3b82f6',
                      fontSize: '0.875rem',
                      marginBottom: '2rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Cursor',
                  props: {
                    content: '$ _'
                  },
                  styles: {
                    base: {
                      color: '#00ff00',
                      fontSize: '1rem'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    // Projects Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Projects Section',
      props: {},
      styles: {
        base: {
          backgroundColor: '#0a0a0a',
          padding: '5rem 2rem',
          borderTop: '1px solid #333'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Projects Container',
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
                content: '## Featured Projects',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  color: '#00ff00',
                  fontSize: '2.5rem',
                  marginBottom: '3rem',
                  textAlign: 'center'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Projects Grid',
              props: {
                content: { columns: 3, gap: '2rem' }
              },
              styles: {
                base: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '2rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Project Card',
                  props: {
                    animations: [{
                      id: generateId(),
                      name: 'Card Hover Effect',
                      trigger: 'onHover',
                      timeline: [
                        { time: 0, properties: { transform: 'translateY(0)', opacity: 1 } },
                        { time: 1, properties: { transform: 'translateY(-4px)', opacity: 1 } }
                      ],
                      options: {
                        duration: 200,
                        delay: 0,
                        easing: 'ease-out'
                      }
                    }]
                  },
                  styles: {
                    base: {
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Project Name',
                      props: {
                        content: 'DevOps Dashboard',
                        attributes: { level: 'h3' }
                      },
                      styles: {
                        base: {
                          color: '#61dafb',
                          fontSize: '1.5rem',
                          marginBottom: '0.5rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Project Description',
                      props: {
                        content: 'Real-time monitoring dashboard built with React, Node.js, and WebSocket. Features live metrics, alerts, and deployment automation.'
                      },
                      styles: {
                        base: {
                          color: '#999',
                          lineHeight: '1.6',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Tech Stack',
                      props: {
                        content: 'React • Node.js • Docker • Kubernetes • Prometheus'
                      },
                      styles: {
                        base: {
                          color: '#00ff00',
                          fontSize: '0.875rem',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Project Links',
                      props: {},
                      styles: {
                        base: {
                          gap: '1rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'link',
                          displayName: 'GitHub Link',
                          props: {
                            content: '[GitHub]',
                            attributes: { href: '#' }
                          },
                          styles: {
                            base: {
                              color: '#3b82f6',
                              textDecoration: 'none',
                              fontSize: '0.875rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'link',
                          displayName: 'Live Demo',
                          props: {
                            content: '[Live Demo]',
                            attributes: { href: '#' }
                          },
                          styles: {
                            base: {
                              color: '#3b82f6',
                              textDecoration: 'none',
                              fontSize: '0.875rem'
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
                  displayName: 'Project Card',
                  props: {
                    animations: [{
                      id: generateId(),
                      name: 'Card Hover Effect',
                      trigger: 'onHover',
                      timeline: [
                        { time: 0, properties: { transform: 'translateY(0)', opacity: 1 } },
                        { time: 1, properties: { transform: 'translateY(-4px)', opacity: 1 } }
                      ],
                      options: {
                        duration: 200,
                        delay: 0,
                        easing: 'ease-out'
                      }
                    }]
                  },
                  styles: {
                    base: {
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Project Name',
                      props: {
                        content: 'CLI Task Manager',
                        attributes: { level: 'h3' }
                      },
                      styles: {
                        base: {
                          color: '#68a063',
                          fontSize: '1.5rem',
                          marginBottom: '0.5rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Project Description',
                      props: {
                        content: 'Terminal-based task management tool with natural language processing. Supports project organization, time tracking, and team collaboration.'
                      },
                      styles: {
                        base: {
                          color: '#999',
                          lineHeight: '1.6',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Tech Stack',
                      props: {
                        content: 'Go • SQLite • Cobra • Bubble Tea'
                      },
                      styles: {
                        base: {
                          color: '#00ff00',
                          fontSize: '0.875rem',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Project Links',
                      props: {},
                      styles: {
                        base: {
                          gap: '1rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'link',
                          displayName: 'GitHub Link',
                          props: {
                            content: '[GitHub]',
                            attributes: { href: '#' }
                          },
                          styles: {
                            base: {
                              color: '#3b82f6',
                              textDecoration: 'none',
                              fontSize: '0.875rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'link',
                          displayName: 'Documentation',
                          props: {
                            content: '[Docs]',
                            attributes: { href: '#' }
                          },
                          styles: {
                            base: {
                              color: '#3b82f6',
                              textDecoration: 'none',
                              fontSize: '0.875rem'
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
                  displayName: 'Project Card',
                  props: {
                    animations: [{
                      id: generateId(),
                      name: 'Card Hover Effect',
                      trigger: 'onHover',
                      timeline: [
                        { time: 0, properties: { transform: 'translateY(0)', opacity: 1 } },
                        { time: 1, properties: { transform: 'translateY(-4px)', opacity: 1 } }
                      ],
                      options: {
                        duration: 200,
                        delay: 0,
                        easing: 'ease-out'
                      }
                    }]
                  },
                  styles: {
                    base: {
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Project Name',
                      props: {
                        content: 'API Gateway',
                        attributes: { level: 'h3' }
                      },
                      styles: {
                        base: {
                          color: '#ff9900',
                          fontSize: '1.5rem',
                          marginBottom: '0.5rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Project Description',
                      props: {
                        content: 'Microservices API gateway with authentication, rate limiting, and request routing. Handles 10K+ requests per second with minimal latency.'
                      },
                      styles: {
                        base: {
                          color: '#999',
                          lineHeight: '1.6',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Tech Stack',
                      props: {
                        content: 'Rust • Tokio • Redis • PostgreSQL'
                      },
                      styles: {
                        base: {
                          color: '#00ff00',
                          fontSize: '0.875rem',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Project Links',
                      props: {},
                      styles: {
                        base: {
                          gap: '1rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'link',
                          displayName: 'GitHub Link',
                          props: {
                            content: '[GitHub]',
                            attributes: { href: '#' }
                          },
                          styles: {
                            base: {
                              color: '#3b82f6',
                              textDecoration: 'none',
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
        }
      ]
    },
    // Footer
    {
      id: generateId(),
      type: 'footer',
      displayName: 'Footer',
      props: {
        content: {
          links: ['GitHub', 'LinkedIn', 'Blog', 'Resume', 'Contact'],
          copyright: '© 2024 John Doe. Built with passion and code.'
        }
      },
      styles: {
        base: {
          backgroundColor: '#0a0a0a',
          color: '#00ff00',
          padding: '3rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid #333'
        }
      }
    }
  ]
};

// Photographer Portfolio Template
export const photographerPortfolioTemplate: Template = {
  id: 'tpl_photographer_portfolio',
  name: 'Photography Portfolio',
  category: 'portfolio',
  description: 'Full-screen gallery portfolio for photographers',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMyMjIiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==',
  tags: ['portfolio', 'photography', 'gallery', 'fullscreen', 'dark'],
  isPremium: false,
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Fullscreen Hero',
      props: {},
      styles: {
        base: {
          minHeight: '100vh',
          position: 'relative',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'image',
          displayName: 'Background Image',
          props: {
            attributes: {
              src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
              alt: 'Hero background'
            }
          },
          styles: {
            base: {
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: '0.7'
            }
          }
        },
        {
          id: generateId(),
          type: 'container',
          displayName: 'Hero Content',
          props: {},
          styles: {
            base: {
              position: 'relative',
              zIndex: '10',
              textAlign: 'center',
              color: 'white'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Main Title',
              props: {
                content: 'ALEX MORGAN',
                attributes: { level: 'h1' }
              },
              styles: {
                base: {
                  fontSize: '5rem',
                  fontWeight: '300',
                  letterSpacing: '0.5rem',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Subtitle',
              props: {
                content: 'Landscape & Nature Photography'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  letterSpacing: '0.2rem',
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
      displayName: 'Gallery Section',
      props: {},
      styles: {
        base: {
          backgroundColor: '#0a0a0a',
          padding: '2rem 0'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'grid',
          displayName: 'Photo Grid',
          props: {
            content: { columns: 3, gap: '2px' }
          },
          styles: {
            base: {
              maxWidth: '100%'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'image',
              displayName: 'Gallery Image',
              props: {
                attributes: {
                  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
                  alt: 'Mountain landscape'
                }
              },
              styles: {
                base: {
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s'
                }
              }
            },
            {
              id: generateId(),
              type: 'image',
              displayName: 'Gallery Image',
              props: {
                attributes: {
                  src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=800&fit=crop',
                  alt: 'Forest'
                }
              },
              styles: {
                base: {
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s'
                }
              }
            },
            {
              id: generateId(),
              type: 'image',
              displayName: 'Gallery Image',
              props: {
                attributes: {
                  src: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=800&fit=crop',
                  alt: 'Ocean waves'
                }
              },
              styles: {
                base: {
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s'
                }
              }
            }
          ]
        }
      ]
    },
    // Contact Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Contact Section',
      props: {},
      styles: {
        base: {
          backgroundColor: '#000',
          color: 'white',
          padding: '6rem 2rem',
          textAlign: 'center'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Contact Content',
          props: {},
          styles: {
            base: {
              maxWidth: '600px',
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Contact Title',
              props: {
                content: 'Get In Touch',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '300',
                  letterSpacing: '0.1rem',
                  marginBottom: '2rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Contact Info',
              props: {
                content: 'For bookings and inquiries'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                  opacity: '0.8'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Email',
              props: {
                content: 'hello@alexmorgan.com'
              },
              styles: {
                base: {
                  fontSize: '1.5rem',
                  color: 'white',
                  marginBottom: '3rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'flex',
              displayName: 'Social Links',
              props: {},
              styles: {
                base: {
                  justifyContent: 'center',
                  gap: '2rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'link',
                  displayName: 'Instagram',
                  props: {
                    content: 'Instagram',
                    attributes: { href: '#' }
                  },
                  styles: {
                    base: {
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      opacity: '0.7',
                      transition: 'opacity 0.2s'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'link',
                  displayName: '500px',
                  props: {
                    content: '500px',
                    attributes: { href: '#' }
                  },
                  styles: {
                    base: {
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      opacity: '0.7',
                      transition: 'opacity 0.2s'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'link',
                  displayName: 'Behance',
                  props: {
                    content: 'Behance',
                    attributes: { href: '#' }
                  },
                  styles: {
                    base: {
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      opacity: '0.7',
                      transition: 'opacity 0.2s'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    // Footer
    {
      id: generateId(),
      type: 'footer',
      displayName: 'Footer',
      props: {
        content: {
          links: [],
          copyright: '© 2024 Alex Morgan Photography. All rights reserved.'
        }
      },
      styles: {
        base: {
          backgroundColor: '#000',
          color: '#666',
          padding: '2rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          borderTop: '1px solid #222'
        }
      }
    }
  ]
};

// Export all portfolio templates
export const portfolioTemplates = [
  designerPortfolioTemplate,
  developerPortfolioTemplate,
  photographerPortfolioTemplate
];