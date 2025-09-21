import type { Template } from '@/types/template';
import { nanoid } from 'nanoid';

// Helper function to generate IDs
function generateId() {
  return nanoid(8);
}

// Modern Startup Landing Page
export const modernStartupTemplate: Template = {
  id: 'tpl_modern_startup',
  name: 'Modern Startup',
  category: 'landing',
  description: 'Ultra-modern startup landing page with glassmorphism and micro-interactions',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDYxMTMxO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzE4MzI2MjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNnMSkiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGI1Y2Y2IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZTBlN2ZmIiBmb250LXNpemU9IjE2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjMwMCI+TW9kZXJuIFN0YXJ0dXA8L3RleHQ+PC9zdmc+',
  tags: ['modern', 'startup', 'glassmorphism', 'dark', 'professional', 'animations'],
  isPremium: false,
  components: [
    // Navigation with glassmorphism effect
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Glass Navigation',
      props: {
        content: {
          logo: 'Nexus',
          links: [
            { text: 'Product', href: '#product' },
            { text: 'Solutions', href: '#solutions' },
            { text: 'Pricing', href: '#pricing' },
            { text: 'Resources', href: '#resources' }
          ]
        }
      },
      styles: {
        base: {
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '1200px',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1rem 2rem',
          zIndex: '1000',
          color: '#E0E7FF'
        }
      }
    },
    
    // Hero Section with gradient mesh background
    {
      id: generateId(),
      type: 'section',
      displayName: 'Hero Section',
      props: {
        animations: [{
          id: generateId(),
          name: 'Fade In',
          trigger: 'onLoad',
          timeline: [],
          options: {
            duration: 1500,
            delay: 0,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            loop: false
          }
        }]
      },
      styles: {
        base: {
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #0F172A, #1E293B, #0F172A)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
      children: [
        // Animated background elements
        {
          id: generateId(),
          type: 'container',
          displayName: 'Background Effects',
          props: {},
          styles: {
            base: {
              position: 'absolute',
              inset: '0',
              overflow: 'hidden',
              pointerEvents: 'none'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Gradient Orb 1',
              props: {},
              styles: {
                base: {
                  position: 'absolute',
                  width: '600px',
                  height: '600px',
                  background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
                  opacity: '0.15',
                  top: '-300px',
                  right: '-300px',
                  animation: 'float 20s ease-in-out infinite'
                }
              }
            },
            {
              id: generateId(),
              type: 'container',
              displayName: 'Gradient Orb 2',
              props: {},
              styles: {
                base: {
                  position: 'absolute',
                  width: '800px',
                  height: '800px',
                  background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
                  opacity: '0.1',
                  bottom: '-400px',
                  left: '-400px',
                  animation: 'float 25s ease-in-out infinite reverse'
                }
              }
            }
          ]
        },
        
        // Main content container
        {
          id: generateId(),
          type: 'container',
          displayName: 'Hero Content',
          props: {},
          styles: {
            base: {
              position: 'relative',
              zIndex: '10',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 2rem',
              textAlign: 'center'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'text',
              displayName: 'Badge',
              props: {
                content: '🚀 NEW: Series A Funding Announcement'
              },
              styles: {
                base: {
                  display: 'inline-block',
                  padding: '0.5rem 1.5rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '50px',
                  fontSize: '0.875rem',
                  color: '#93BBFB',
                  marginBottom: '2rem',
                  backdropFilter: 'blur(10px)'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Main Heading',
              props: {
                content: 'The Future of Digital Innovation Starts Here',
                attributes: { level: 'h1' },
                animations: [{
                  id: generateId(),
                  name: 'Hero Title Animation',
                  trigger: 'onLoad',
                  timeline: [
                    { time: 0, properties: { opacity: 0, transform: 'translateY(20px)' } },
                    { time: 1, properties: { opacity: 1, transform: 'translateY(0)' } }
                  ],
                  options: {
                    duration: 1000,
                    delay: 300,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
                  }
                }]
              },
              styles: {
                base: {
                  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                  fontWeight: '800',
                  lineHeight: '1.1',
                  background: 'linear-gradient(to right, #E0E7FF, #C7D2FE, #A5B4FC)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1.5rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Subheading',
              props: {
                content: 'Build, scale, and transform your business with our cutting-edge platform. Join thousands of companies already revolutionizing their industry.'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  lineHeight: '1.8',
                  color: '#94A3B8',
                  maxWidth: '700px',
                  margin: '0 auto 3rem'
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
                  gap: '1rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Primary CTA',
                  props: {
                    content: 'Start Free Trial',
                    attributes: {
                      href: '#signup'
                    },
                    animations: [{
                      id: generateId(),
                      name: 'Hover Lift',
                      trigger: 'onHover',
                      timeline: [
                        { time: 0, properties: { transform: 'translateY(0)', opacity: 1 } },
                        { time: 1, properties: { transform: 'translateY(-4px)', opacity: 1 } }
                      ],
                      options: {
                        duration: 300,
                        delay: 0,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                      }
                    }]
                  },
                  styles: {
                    base: {
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 20px 40px -20px rgba(59, 130, 246, 0.5)'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Secondary CTA',
                  props: {
                    content: 'Watch Demo',
                    attributes: {
                      href: '#demo'
                    }
                  },
                  styles: {
                    base: {
                      padding: '1rem 2rem',
                      background: 'transparent',
                      color: '#E0E7FF',
                      border: '1px solid rgba(224, 231, 255, 0.2)',
                      borderRadius: '12px',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backdropFilter: 'blur(10px)'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    
    // Feature Cards Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Features Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          background: '#0F172A',
          position: 'relative'
        }
      },
      children: [
        {
          id: generateId(),
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
              id: generateId(),
              type: 'heading',
              displayName: 'Features Title',
              props: {
                content: 'Powerful Features for Modern Teams',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#E0E7FF',
                  marginBottom: '4rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Features Grid',
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
                // Feature Card 1
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Feature Card',
                  props: {
                    animations: [{
                      id: generateId(),
                      name: 'Fade In Up',
                      trigger: 'onScroll',
                      timeline: [
                        { time: 0, properties: { opacity: 0, transform: 'translateY(30px)' } },
                        { time: 1, properties: { opacity: 1, transform: 'translateY(0)' } }
                      ],
                      options: {
                        duration: 800,
                        delay: 200,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
                      },
                      scrollOptions: {
                        threshold: 0.2
                      }
                    }]
                  },
                  styles: {
                    base: {
                      padding: '2.5rem',
                      background: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Icon Container',
                      props: {},
                      styles: {
                        base: {
                          width: '60px',
                          height: '60px',
                          background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1.5rem',
                          fontSize: '1.5rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Icon',
                          props: {
                            content: '⚡'
                          },
                          styles: {
                            base: {}
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Feature Title',
                      props: {
                        content: 'Lightning Fast',
                        attributes: { level: 'h3' }
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          color: '#E0E7FF',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Feature Description',
                      props: {
                        content: 'Experience blazing-fast performance with our optimized infrastructure designed for scale.'
                      },
                      styles: {
                        base: {
                          fontSize: '1rem',
                          lineHeight: '1.8',
                          color: '#94A3B8'
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
    
    // Testimonials Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Testimonials Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          backgroundColor: '#0F172A',
          position: 'relative'
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
              maxWidth: '1200px',
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'text',
              displayName: 'Section Label',
              props: {
                content: 'TESTIMONIALS'
              },
              styles: {
                base: {
                  fontSize: '0.875rem',
                  color: '#3B82F6',
                  letterSpacing: '0.1rem',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Testimonials Title',
              props: {
                content: 'What Our Customers Say',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#E0E7FF',
                  marginBottom: '4rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Testimonials Grid',
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
                  displayName: 'Testimonial Card',
                  props: {
                    animations: [{
                      id: generateId(),
                      name: 'Fade In Scale',
                      trigger: 'onScroll',
                      timeline: [
                        { time: 0, properties: { opacity: 0, transform: 'scale(0.9)' } },
                        { time: 1, properties: { opacity: 1, transform: 'scale(1)' } }
                      ],
                      options: {
                        duration: 600,
                        delay: 100,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
                      },
                      scrollOptions: {
                        threshold: 0.3
                      }
                    }]
                  },
                  styles: {
                    base: {
                      padding: '2.5rem',
                      background: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Stars',
                      props: {
                        content: '⭐⭐⭐⭐⭐'
                      },
                      styles: {
                        base: {
                          fontSize: '1.25rem',
                          marginBottom: '1.5rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Testimonial Text',
                      props: {
                        content: '"Nexus has transformed how we build and deploy our applications. The platform is intuitive, powerful, and has saved us countless hours."'
                      },
                      styles: {
                        base: {
                          fontSize: '1.125rem',
                          color: '#E0E7FF',
                          lineHeight: '1.8',
                          marginBottom: '2rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Author Info',
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
                              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Author Details',
                          props: {},
                          styles: {
                            base: {}
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Author Name',
                              props: {
                                content: 'Sarah Johnson'
                              },
                              styles: {
                                base: {
                                  color: '#E0E7FF',
                                  fontWeight: '600',
                                  marginBottom: '0.25rem'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Author Title',
                              props: {
                                content: 'CTO at TechCorp'
                              },
                              styles: {
                                base: {
                                  fontSize: '0.875rem',
                                  color: '#94A3B8'
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
                  props: {
                    animations: [{
                      id: generateId(),
                      name: 'Fade In Scale',
                      trigger: 'onScroll',
                      timeline: [
                        { time: 0, properties: { opacity: 0, transform: 'scale(0.9)' } },
                        { time: 1, properties: { opacity: 1, transform: 'scale(1)' } }
                      ],
                      options: {
                        duration: 600,
                        delay: 100,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
                      },
                      scrollOptions: {
                        threshold: 0.3
                      }
                    }]
                  },
                  styles: {
                    base: {
                      padding: '2.5rem',
                      background: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Stars',
                      props: {
                        content: '⭐⭐⭐⭐⭐'
                      },
                      styles: {
                        base: {
                          fontSize: '1.25rem',
                          marginBottom: '1.5rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Testimonial Text',
                      props: {
                        content: '"The scalability and performance improvements we\'ve seen since switching to Nexus are incredible. Highly recommended!"'
                      },
                      styles: {
                        base: {
                          fontSize: '1.125rem',
                          color: '#E0E7FF',
                          lineHeight: '1.8',
                          marginBottom: '2rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Author Info',
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
                              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Author Details',
                          props: {},
                          styles: {
                            base: {}
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Author Name',
                              props: {
                                content: 'Michael Chen'
                              },
                              styles: {
                                base: {
                                  color: '#E0E7FF',
                                  fontWeight: '600',
                                  marginBottom: '0.25rem'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Author Title',
                              props: {
                                content: 'Founder at StartupX'
                              },
                              styles: {
                                base: {
                                  fontSize: '0.875rem',
                                  color: '#94A3B8'
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
                  props: {
                    animations: [{
                      id: generateId(),
                      name: 'Fade In Scale',
                      trigger: 'onScroll',
                      timeline: [
                        { time: 0, properties: { opacity: 0, transform: 'scale(0.9)' } },
                        { time: 1, properties: { opacity: 1, transform: 'scale(1)' } }
                      ],
                      options: {
                        duration: 600,
                        delay: 100,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
                      },
                      scrollOptions: {
                        threshold: 0.3
                      }
                    }]
                  },
                  styles: {
                    base: {
                      padding: '2.5rem',
                      background: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Stars',
                      props: {
                        content: '⭐⭐⭐⭐⭐'
                      },
                      styles: {
                        base: {
                          fontSize: '1.25rem',
                          marginBottom: '1.5rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Testimonial Text',
                      props: {
                        content: '"Best investment we\'ve made this year. The ROI has been phenomenal and the support team is amazing."'
                      },
                      styles: {
                        base: {
                          fontSize: '1.125rem',
                          color: '#E0E7FF',
                          lineHeight: '1.8',
                          marginBottom: '2rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Author Info',
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
                              background: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Author Details',
                          props: {},
                          styles: {
                            base: {}
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Author Name',
                              props: {
                                content: 'Emily Davis'
                              },
                              styles: {
                                base: {
                                  color: '#E0E7FF',
                                  fontWeight: '600',
                                  marginBottom: '0.25rem'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Author Title',
                              props: {
                                content: 'Head of Engineering at Scale'
                              },
                              styles: {
                                base: {
                                  fontSize: '0.875rem',
                                  color: '#94A3B8'
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
    
    // Pricing Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Pricing Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          background: 'linear-gradient(to bottom, #0F172A, #1E293B)',
          position: 'relative'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Pricing Container',
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
              type: 'text',
              displayName: 'Section Label',
              props: {
                content: 'PRICING'
              },
              styles: {
                base: {
                  fontSize: '0.875rem',
                  color: '#3B82F6',
                  letterSpacing: '0.1rem',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Pricing Title',
              props: {
                content: 'Simple, Transparent Pricing',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#E0E7FF',
                  marginBottom: '1.5rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Pricing Subtitle',
              props: {
                content: 'Choose the plan that works best for your team'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  color: '#94A3B8',
                  textAlign: 'center',
                  marginBottom: '4rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Pricing Grid',
              props: {
                content: { columns: 3, gap: '2rem' }
              },
              styles: {
                base: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '2rem',
                  alignItems: 'stretch'
                }
              },
              children: [
                // Starter Plan
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Pricing Card',
                  props: {
                    animations: [{
                      id: generateId(),
                      name: 'Pricing Card Animation',
                      trigger: 'onScroll',
                      timeline: [
                        { time: 0, properties: { opacity: 0, transform: 'translateY(40px)' } },
                        { time: 1, properties: { opacity: 1, transform: 'translateY(0)' } }
                      ],
                      options: {
                        duration: 700,
                        delay: 100,
                        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      },
                      scrollOptions: {
                        threshold: 0.2
                      }
                    }]
                  },
                  styles: {
                    base: {
                      padding: '3rem',
                      background: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      textAlign: 'center',
                      position: 'relative'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Plan Name',
                      props: {
                        content: 'Starter'
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          color: '#E0E7FF',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Price Container',
                      props: {},
                      styles: {
                        base: {
                          marginBottom: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Price',
                          props: {},
                          styles: {
                            base: {
                              justifyContent: 'center',
                              alignItems: 'baseline',
                              gap: '0.5rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Currency',
                              props: {
                                content: '$'
                              },
                              styles: {
                                base: {
                                  fontSize: '1.5rem',
                                  color: '#94A3B8'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Amount',
                              props: {
                                content: '29'
                              },
                              styles: {
                                base: {
                                  fontSize: '3.5rem',
                                  fontWeight: '700',
                                  color: '#E0E7FF'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Period',
                              props: {
                                content: '/month'
                              },
                              styles: {
                                base: {
                                  fontSize: '1.25rem',
                                  color: '#94A3B8'
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
                      displayName: 'Features List',
                      props: {},
                      styles: {
                        base: {
                          textAlign: 'left',
                          marginBottom: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 1',
                          props: {
                            content: '✓ Up to 10 projects'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 2',
                          props: {
                            content: '✓ 5 team members'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 3',
                          props: {
                            content: '✓ Basic analytics'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 4',
                          props: {
                            content: '✓ Email support'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              display: 'block'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'button',
                      displayName: 'CTA Button',
                      props: {
                        content: 'Get Started'
                      },
                      styles: {
                        base: {
                          width: '100%',
                          padding: '1rem',
                          backgroundColor: 'transparent',
                          color: '#E0E7FF',
                          border: '1px solid rgba(224, 231, 255, 0.2)',
                          borderRadius: '12px',
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }
                      }
                    }
                  ]
                },
                // Pro Plan
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Pricing Card',
                  props: {},
                  styles: {
                    base: {
                      padding: '3rem',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '20px',
                      textAlign: 'center',
                      position: 'relative',
                      transform: 'scale(1.05)'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Popular Badge',
                      props: {},
                      styles: {
                        base: {
                          position: 'absolute',
                          top: '-1rem',
                          right: '2rem',
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          padding: '0.5rem 1.5rem',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Badge Text',
                          props: {
                            content: 'MOST POPULAR'
                          },
                          styles: {
                            base: {}
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Plan Name',
                      props: {
                        content: 'Professional'
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          color: '#E0E7FF',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Price Container',
                      props: {},
                      styles: {
                        base: {
                          marginBottom: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Price',
                          props: {},
                          styles: {
                            base: {
                              justifyContent: 'center',
                              alignItems: 'baseline',
                              gap: '0.5rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Currency',
                              props: {
                                content: '$'
                              },
                              styles: {
                                base: {
                                  fontSize: '1.5rem',
                                  color: '#94A3B8'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Amount',
                              props: {
                                content: '99'
                              },
                              styles: {
                                base: {
                                  fontSize: '3.5rem',
                                  fontWeight: '700',
                                  color: '#E0E7FF'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Period',
                              props: {
                                content: '/month'
                              },
                              styles: {
                                base: {
                                  fontSize: '1.25rem',
                                  color: '#94A3B8'
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
                      displayName: 'Features List',
                      props: {},
                      styles: {
                        base: {
                          textAlign: 'left',
                          marginBottom: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 1',
                          props: {
                            content: '✓ Unlimited projects'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 2',
                          props: {
                            content: '✓ Unlimited team members'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 3',
                          props: {
                            content: '✓ Advanced analytics'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 4',
                          props: {
                            content: '✓ Priority support'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 5',
                          props: {
                            content: '✓ API access'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              display: 'block'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'button',
                      displayName: 'CTA Button',
                      props: {
                        content: 'Start Free Trial'
                      },
                      styles: {
                        base: {
                          width: '100%',
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }
                      }
                    }
                  ]
                },
                // Enterprise Plan
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Pricing Card',
                  props: {},
                  styles: {
                    base: {
                      padding: '3rem',
                      background: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      textAlign: 'center',
                      position: 'relative'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Plan Name',
                      props: {
                        content: 'Enterprise'
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          color: '#E0E7FF',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Price Container',
                      props: {},
                      styles: {
                        base: {
                          marginBottom: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Custom Price',
                          props: {
                            content: 'Custom'
                          },
                          styles: {
                            base: {
                              fontSize: '2.5rem',
                              fontWeight: '700',
                              color: '#E0E7FF',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Contact Sales',
                          props: {
                            content: 'Contact sales for pricing'
                          },
                          styles: {
                            base: {
                              fontSize: '1rem',
                              color: '#94A3B8'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Features List',
                      props: {},
                      styles: {
                        base: {
                          textAlign: 'left',
                          marginBottom: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 1',
                          props: {
                            content: '✓ Everything in Pro'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 2',
                          props: {
                            content: '✓ Custom integrations'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 3',
                          props: {
                            content: '✓ Dedicated support'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 4',
                          props: {
                            content: '✓ SLA guarantees'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              marginBottom: '1rem',
                              display: 'block'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Feature 5',
                          props: {
                            content: '✓ On-premise deployment'
                          },
                          styles: {
                            base: {
                              color: '#94A3B8',
                              display: 'block'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'button',
                      displayName: 'CTA Button',
                      props: {
                        content: 'Contact Sales'
                      },
                      styles: {
                        base: {
                          width: '100%',
                          padding: '1rem',
                          backgroundColor: 'transparent',
                          color: '#E0E7FF',
                          border: '1px solid rgba(224, 231, 255, 0.2)',
                          borderRadius: '12px',
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
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
    
    // CTA Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'CTA Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          background: '#1E293B',
          position: 'relative',
          overflow: 'hidden'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'CTA Content',
          props: {},
          styles: {
            base: {
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
              position: 'relative',
              zIndex: '10'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'CTA Title',
              props: {
                content: 'Ready to Transform Your Business?',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3.5rem',
                  fontWeight: '700',
                  color: '#E0E7FF',
                  marginBottom: '1.5rem',
                  lineHeight: '1.2'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'CTA Description',
              props: {
                content: 'Join thousands of companies already using Nexus to build better products faster.'
              },
              styles: {
                base: {
                  fontSize: '1.5rem',
                  color: '#94A3B8',
                  marginBottom: '3rem'
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
                  gap: '1rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Primary Button',
                  props: {
                    content: 'Start Your Free Trial'
                  },
                  styles: {
                    base: {
                      padding: '1.25rem 3rem',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Secondary Button',
                  props: {
                    content: 'Schedule Demo'
                  },
                  styles: {
                    base: {
                      padding: '1.25rem 3rem',
                      backgroundColor: 'transparent',
                      color: '#E0E7FF',
                      border: '1px solid rgba(224, 231, 255, 0.2)',
                      borderRadius: '12px',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }
                  }
                }
              ]
            }
          ]
        },
        // Background decoration
        {
          id: generateId(),
          type: 'container',
          displayName: 'Background Decoration',
          props: {},
          styles: {
            base: {
              position: 'absolute',
              inset: '0',
              overflow: 'hidden',
              pointerEvents: 'none'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Gradient Orb',
              props: {},
              styles: {
                base: {
                  position: 'absolute',
                  width: '800px',
                  height: '800px',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                  bottom: '-400px',
                  right: '-400px'
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
          links: ['Product', 'Pricing', 'Company', 'Blog', 'Contact'],
          copyright: '© 2024 Nexus. All rights reserved.'
        }
      },
      styles: {
        base: {
          backgroundColor: '#0a0a0a',
          padding: '4rem 2rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }
    }
  ]
};

// Professional Agency Template
export const professionalAgencyTemplate: Template = {
  id: 'tpl_professional_agency',
  name: 'Creative Agency',
  category: 'landing',
  description: 'Sophisticated agency website with portfolio showcase and elegant animations',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZBRUFGQSI+PC9yZWN0PjxsaW5lIHgxPSI1MCIgeTE9IjUwIiB4Mj0iMjUwIiB5Mj0iNTAiIHN0cm9rZT0iI0VGNDQ0NCIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTI1IiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI1MCUiIHk9IjE3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyIgZm9udC1zaXplPSIxNCIgZm9udC1ZW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI1MDAiPkNyZWF0aXZlIEFnZW5jeTwvdGV4dD48L3N2Zz4=',
  tags: ['agency', 'creative', 'portfolio', 'minimal', 'elegant', 'professional'],
  isPremium: false,
  components: [
    // Navigation
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Agency Navigation',
      props: {
        content: {
          logo: 'STUDIO',
          links: [
            { text: 'Work', href: '#work' },
            { text: 'Services', href: '#services' },
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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          zIndex: '1000',
          padding: '1.5rem 0'
        }
      }
    },
    
    // Hero Section
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
          background: 'linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 100%)',
          paddingTop: '80px',
          position: 'relative',
          overflow: 'hidden'
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
              maxWidth: '900px',
              margin: '0 auto',
              padding: '0 2rem',
              position: 'relative',
              zIndex: '10'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'text',
              displayName: 'Tagline',
              props: {
                content: 'CREATIVE STUDIO'
              },
              styles: {
                base: {
                  fontSize: '0.875rem',
                  letterSpacing: '0.3rem',
                  color: '#EF4444',
                  fontWeight: '600',
                  marginBottom: '1.5rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Main Heading',
              props: {
                content: 'We craft digital experiences that matter',
                attributes: { level: 'h1' }
              },
              styles: {
                base: {
                  fontSize: '4rem',
                  fontWeight: '700',
                  color: '#111111',
                  lineHeight: '1.1',
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
                content: 'Award-winning design studio specializing in branding, web design, and digital marketing. We help ambitious brands tell their story.'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  color: '#666666',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  margin: '0 auto 3rem'
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
                  gap: '1.5rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Primary CTA',
                  props: {
                    content: 'View Our Work'
                  },
                  styles: {
                    base: {
                      backgroundColor: '#EF4444',
                      color: 'white',
                      padding: '1rem 2.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      borderRadius: '50px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Secondary CTA',
                  props: {
                    content: 'Start a Project'
                  },
                  styles: {
                    base: {
                      backgroundColor: 'transparent',
                      color: '#111111',
                      padding: '1rem 2.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      borderRadius: '50px',
                      border: '2px solid #111111',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }
                  }
                }
              ]
            }
          ]
        },
        // Decorative Elements
        {
          id: generateId(),
          type: 'container',
          displayName: 'Decorative Circle',
          props: {},
          styles: {
            base: {
              position: 'absolute',
              top: '10%',
              right: '10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: '2px solid #EF4444',
              opacity: '0.2'
            }
          },
          children: []
        }
      ]
    },

    // Services Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Services Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          backgroundColor: '#FFFFFF'
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
              displayName: 'Services Title',
              props: {
                content: 'What We Do',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  color: '#111111'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Services Subtitle',
              props: {
                content: 'We offer a full range of creative services to help your brand shine'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  color: '#666666',
                  textAlign: 'center',
                  marginBottom: '4rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Services Grid',
              props: {
                content: { columns: 3, gap: '3rem' }
              },
              styles: {
                base: {}
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Service Card',
                  props: {},
                  styles: {
                    base: {
                      textAlign: 'center',
                      padding: '2rem',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Icon Container',
                      props: {},
                      styles: {
                        base: {
                          width: '80px',
                          height: '80px',
                          margin: '0 auto 1.5rem',
                          backgroundColor: '#FEF2F2',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Icon',
                          props: { content: '🎨' },
                          styles: { base: { fontSize: '2rem' } }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Service Title',
                      props: {
                        content: 'Brand Design',
                        attributes: { level: 'h3' }
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          marginBottom: '1rem',
                          color: '#111111'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Service Description',
                      props: {
                        content: 'Creating memorable brand identities that resonate with your target audience and stand the test of time.'
                      },
                      styles: {
                        base: {
                          color: '#666666',
                          lineHeight: '1.6'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Service Card',
                  props: {},
                  styles: {
                    base: {
                      textAlign: 'center',
                      padding: '2rem',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Icon Container',
                      props: {},
                      styles: {
                        base: {
                          width: '80px',
                          height: '80px',
                          margin: '0 auto 1.5rem',
                          backgroundColor: '#FEF2F2',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Icon',
                          props: { content: '💻' },
                          styles: { base: { fontSize: '2rem' } }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Service Title',
                      props: {
                        content: 'Web Development',
                        attributes: { level: 'h3' }
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          marginBottom: '1rem',
                          color: '#111111'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Service Description',
                      props: {
                        content: 'Building fast, responsive websites and applications that deliver exceptional user experiences.'
                      },
                      styles: {
                        base: {
                          color: '#666666',
                          lineHeight: '1.6'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Service Card',
                  props: {},
                  styles: {
                    base: {
                      textAlign: 'center',
                      padding: '2rem',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Icon Container',
                      props: {},
                      styles: {
                        base: {
                          width: '80px',
                          height: '80px',
                          margin: '0 auto 1.5rem',
                          backgroundColor: '#FEF2F2',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Icon',
                          props: { content: '📱' },
                          styles: { base: { fontSize: '2rem' } }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Service Title',
                      props: {
                        content: 'Digital Marketing',
                        attributes: { level: 'h3' }
                      },
                      styles: {
                        base: {
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          marginBottom: '1rem',
                          color: '#111111'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Service Description',
                      props: {
                        content: 'Strategic marketing campaigns that increase your visibility and drive meaningful engagement.'
                      },
                      styles: {
                        base: {
                          color: '#666666',
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
    },

    // Portfolio Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Portfolio Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          backgroundColor: '#F9F9F9'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Portfolio Container',
          props: {},
          styles: {
            base: {
              maxWidth: '1400px',
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Portfolio Title',
              props: {
                content: 'Selected Works',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: '4rem',
                  color: '#111111'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Portfolio Grid',
              props: {
                content: { columns: 2, gap: '3rem' }
              },
              styles: {
                base: {}
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Portfolio Item',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'image',
                      displayName: 'Project Image',
                      props: {
                        attributes: {
                          src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
                          alt: 'Brand Design Project'
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
                          padding: '2.5rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Category',
                          props: { content: 'BRAND IDENTITY' },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#EF4444',
                              fontWeight: '600',
                              letterSpacing: '0.1rem',
                              marginBottom: '0.75rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Project Title',
                          props: {
                            content: 'Tech Startup Rebrand',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.75rem',
                              fontWeight: '600',
                              marginBottom: '1rem',
                              color: '#111111'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Project Description',
                          props: {
                            content: 'Complete brand redesign for an innovative fintech startup, including logo, visual identity, and brand guidelines.'
                          },
                          styles: {
                            base: {
                              color: '#666666',
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
                  type: 'container',
                  displayName: 'Portfolio Item',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'image',
                      displayName: 'Project Image',
                      props: {
                        attributes: {
                          src: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop',
                          alt: 'Web Development Project'
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
                          padding: '2.5rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Category',
                          props: { content: 'WEB DEVELOPMENT' },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#EF4444',
                              fontWeight: '600',
                              letterSpacing: '0.1rem',
                              marginBottom: '0.75rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Project Title',
                          props: {
                            content: 'E-commerce Platform',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.75rem',
                              fontWeight: '600',
                              marginBottom: '1rem',
                              color: '#111111'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Project Description',
                          props: {
                            content: 'Custom e-commerce solution with advanced inventory management and seamless payment integration.'
                          },
                          styles: {
                            base: {
                              color: '#666666',
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
    },

    // CTA Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'CTA Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          backgroundColor: '#111111',
          color: 'white',
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
              displayName: 'CTA Heading',
              props: {
                content: 'Ready to start your project?',
                attributes: { level: 'h2' }
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
              displayName: 'CTA Text',
              props: {
                content: "Let's create something amazing together. Get in touch to discuss your next big idea."
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  marginBottom: '3rem',
                  opacity: '0.9'
                }
              }
            },
            {
              id: generateId(),
              type: 'button',
              displayName: 'CTA Button',
              props: {
                content: 'Get in Touch'
              },
              styles: {
                base: {
                  backgroundColor: '#EF4444',
                  color: 'white',
                  padding: '1.25rem 3rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
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
          links: ['Privacy Policy', 'Terms of Service', 'Contact'],
          copyright: '© 2024 Creative Studio. All rights reserved.'
        }
      },
      styles: {
        base: {
          backgroundColor: '#FAFAFA',
          padding: '3rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid #E5E5E5'
        }
      }
    }
  ]
};

// Export all modern templates
export const modernTemplates = [
  modernStartupTemplate,
  professionalAgencyTemplate
];