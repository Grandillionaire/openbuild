import type { Template } from '@/types/template';
import { nanoid } from 'nanoid';

// Helper function to generate IDs
function generateId() {
  return nanoid(8);
}

// Professional SaaS Landing Page Template
export const saasLandingTemplate: Template = {
  id: 'tpl_saas_landing',
  name: 'SaaS Product Launch',
  category: 'landing',
  description: 'Premium SaaS landing page with modern design and animations',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4YjVjZjY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzE0N2ZmO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2cpIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI1MCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PGNpcmNsZSBjeD0iMjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNjAwIj5TYWFTIFByb2R1Y3Q8L3RleHQ+PC9zdmc+',
  tags: ['saas', 'modern', 'professional', 'premium', 'gradient', 'animations'],
  isPremium: false,
  components: [
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Navigation',
      props: {
        content: {
          logo: 'CloudFlow',
          links: [
            { text: 'Features', href: '#features' },
            { text: 'Pricing', href: '#pricing' },
            { text: 'Testimonials', href: '#testimonials' },
            { text: 'Contact', href: '#contact' }
          ]
        }
      },
      styles: {
        base: {
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          zIndex: '1000',
          padding: '1.25rem 2rem'
        }
      }
    },
    {
      id: generateId(),
      type: 'hero',
      displayName: 'Hero Section',
      props: {
        content: {
          heading: 'Scale Your Business with Next-Gen SaaS',
          subheading: 'Join 10,000+ companies using CloudFlow to transform their operations with powerful automation and seamless collaboration.',
          buttonText: 'Start 14-Day Free Trial',
          buttonUrl: '#signup'
        },
        animations: [{
          id: nanoid(8),
          name: 'Fade In',
          trigger: 'onLoad',
          timeline: [],
          options: {
            duration: 1200,
            delay: 200,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            loop: false
          }
        }]
      },
      styles: {
        base: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          color: 'white',
          textAlign: 'center',
          padding: '6rem 2rem',
          paddingTop: '8rem',
          position: 'relative',
          overflow: 'hidden'
        }
      }
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Features Section',
      props: {
        content: {
          heading: 'Everything You Need to Succeed'
        }
      },
      styles: {
        base: {
          padding: '6rem 2rem',
          backgroundColor: '#FAFBFC',
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
              type: 'text',
              displayName: 'Section Label',
              props: {
                content: 'FEATURES'
              },
              styles: {
                base: {
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  color: '#8B5CF6',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Section Title',
              props: {
                content: 'Everything You Need to Succeed',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '800',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  color: '#111827',
                  lineHeight: '1.2'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Section Description',
              props: {
                content: 'Built with cutting-edge technology to help your team achieve more.'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  textAlign: 'center',
                  color: '#6B7280',
                  marginBottom: '4rem',
                  maxWidth: '600px',
                  margin: '0 auto 4rem'
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
              maxWidth: '1200px',
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Feature Card',
              props: {},
              styles: {
                base: {
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Icon',
                  props: { content: '🚀' },
                  styles: {
                    base: {
                      fontSize: '3rem',
                      marginBottom: '1rem'
                    }
                  }
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
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#1f2937'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Feature Description',
                  props: {
                    content: 'Experience blazing-fast performance with our optimized infrastructure and smart caching.'
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
              displayName: 'Feature Card',
              props: {},
              styles: {
                base: {
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Icon',
                  props: { content: '🔒' },
                  styles: {
                    base: {
                      fontSize: '3rem',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Feature Title',
                  props: {
                    content: 'Enterprise Security',
                    attributes: { level: 'h3' }
                  },
                  styles: {
                    base: {
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#1f2937'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Feature Description',
                  props: {
                    content: 'Bank-level encryption and security protocols keep your data safe and compliant.'
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
              displayName: 'Feature Card',
              props: {},
              styles: {
                base: {
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Icon',
                  props: { content: '📊' },
                  styles: {
                    base: {
                      fontSize: '3rem',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Feature Title',
                  props: {
                    content: 'Advanced Analytics',
                    attributes: { level: 'h3' }
                  },
                  styles: {
                    base: {
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#1f2937'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Feature Description',
                  props: {
                    content: 'Get actionable insights with real-time analytics and customizable dashboards.'
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
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Testimonials Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          backgroundColor: '#ffffff',
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
                  fontWeight: '600',
                  textAlign: 'center',
                  color: '#8B5CF6',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Section Title',
              props: {
                content: 'Loved by Teams Worldwide',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '800',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  color: '#111827'
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
                  gap: '2rem',
                  marginTop: '3rem'
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
                      backgroundColor: '#F9FAFB',
                      padding: '2rem',
                      borderRadius: '16px',
                      position: 'relative'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Quote',
                      props: {
                        content: '"CloudFlow transformed how we handle our operations. The automation features alone saved us 20 hours per week."'
                      },
                      styles: {
                        base: {
                          fontSize: '1.125rem',
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
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Author Details',
                          props: {},
                          styles: {
                            base: {
                              flex: '1'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Name',
                              props: {
                                content: 'Sarah Johnson'
                              },
                              styles: {
                                base: {
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
                              props: {
                                content: 'CEO at TechCorp'
                              },
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
                      backgroundColor: '#F9FAFB',
                      padding: '2rem',
                      borderRadius: '16px'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Quote',
                      props: {
                        content: '"Best investment we made this year. The ROI was evident within the first month of implementation."'
                      },
                      styles: {
                        base: {
                          fontSize: '1.125rem',
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
                              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Author Details',
                          props: {},
                          styles: {
                            base: {
                              flex: '1'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Name',
                              props: {
                                content: 'Michael Chen'
                              },
                              styles: {
                                base: {
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
                              props: {
                                content: 'CTO at StartupXYZ'
                              },
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
                      backgroundColor: '#F9FAFB',
                      padding: '2rem',
                      borderRadius: '16px'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Quote',
                      props: {
                        content: '"The customer support is exceptional. They helped us customize everything to our exact needs."'
                      },
                      styles: {
                        base: {
                          fontSize: '1.125rem',
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
                              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Author Details',
                          props: {},
                          styles: {
                            base: {
                              flex: '1'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Name',
                              props: {
                                content: 'Emily Rodriguez'
                              },
                              styles: {
                                base: {
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
                              props: {
                                content: 'Product Manager at InnovateCo'
                              },
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
    {
      id: generateId(),
      type: 'section',
      displayName: 'Pricing Section',
      props: {},
      styles: {
        base: {
          padding: '6rem 2rem',
          backgroundColor: '#F9FAFB'
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
                  fontWeight: '600',
                  textAlign: 'center',
                  color: '#8B5CF6',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Section Title',
              props: {
                content: 'Simple, Transparent Pricing',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '800',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  color: '#111827'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Section Description',
              props: {
                content: 'Choose the perfect plan for your business needs'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  textAlign: 'center',
                  color: '#6B7280',
                  marginBottom: '4rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Pricing Grid',
              props: {},
              styles: {
                base: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '2rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Pricing Card - Starter',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      padding: '2.5rem',
                      borderRadius: '16px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #E5E7EB',
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
                          fontWeight: '700',
                          color: '#111827',
                          marginBottom: '0.5rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Plan Description',
                      props: {
                        content: 'Perfect for small teams'
                      },
                      styles: {
                        base: {
                          color: '#6B7280',
                          marginBottom: '2rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Price Container',
                      props: {},
                      styles: {
                        base: {
                          alignItems: 'baseline',
                          marginBottom: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Price',
                          props: {
                            content: '$29'
                          },
                          styles: {
                            base: {
                              fontSize: '3rem',
                              fontWeight: '800',
                              color: '#111827'
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
                              fontSize: '1.125rem',
                              color: '#6B7280',
                              marginLeft: '0.5rem'
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
                          marginBottom: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: 'Up to 5 team members' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: '10GB storage' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: 'Basic analytics' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
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
                          padding: '0.875rem',
                          backgroundColor: '#F3F4F6',
                          color: '#111827',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Pricing Card - Professional',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      padding: '2.5rem',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(139, 92, 246, 0.15)',
                      border: '2px solid #8B5CF6',
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
                          top: '-12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: '#8B5CF6',
                          color: 'white',
                          padding: '0.25rem 1rem',
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
                          props: { content: 'MOST POPULAR' },
                          styles: { base: {} }
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
                          fontWeight: '700',
                          color: '#111827',
                          marginBottom: '0.5rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Plan Description',
                      props: {
                        content: 'Best for growing teams'
                      },
                      styles: {
                        base: {
                          color: '#6B7280',
                          marginBottom: '2rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Price Container',
                      props: {},
                      styles: {
                        base: {
                          alignItems: 'baseline',
                          marginBottom: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Price',
                          props: {
                            content: '$79'
                          },
                          styles: {
                            base: {
                              fontSize: '3rem',
                              fontWeight: '800',
                              color: '#8B5CF6'
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
                              fontSize: '1.125rem',
                              color: '#6B7280',
                              marginLeft: '0.5rem'
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
                          marginBottom: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: 'Unlimited team members' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: '100GB storage' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: 'Advanced analytics & API' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: 'Priority support' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
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
                          padding: '0.875rem',
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Pricing Card - Enterprise',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      padding: '2.5rem',
                      borderRadius: '16px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #E5E7EB',
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
                          fontWeight: '700',
                          color: '#111827',
                          marginBottom: '0.5rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Plan Description',
                      props: {
                        content: 'For large organizations'
                      },
                      styles: {
                        base: {
                          color: '#6B7280',
                          marginBottom: '2rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Custom Pricing',
                      props: {
                        content: 'Custom Pricing'
                      },
                      styles: {
                        base: {
                          fontSize: '2rem',
                          fontWeight: '800',
                          color: '#111827',
                          marginBottom: '2rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Features List',
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
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: 'Everything in Professional' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: 'Unlimited storage' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: 'SSO & Advanced Security' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Feature Item',
                          props: {},
                          styles: {
                            base: {
                              alignItems: 'center',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Check Icon',
                              props: { content: '✓' },
                              styles: {
                                base: {
                                  color: '#10B981',
                                  marginRight: '0.75rem',
                                  fontWeight: '700'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Feature Text',
                              props: { content: 'Dedicated account manager' },
                              styles: {
                                base: {
                                  color: '#374151'
                                }
                              }
                            }
                          ]
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
                          padding: '0.875rem',
                          backgroundColor: '#111827',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
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
    {
      id: generateId(),
      type: 'section',
      displayName: 'FAQ Section',
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
          displayName: 'FAQ Container',
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
              type: 'text',
              displayName: 'Section Label',
              props: {
                content: 'FAQ'
              },
              styles: {
                base: {
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  color: '#8B5CF6',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Section Title',
              props: {
                content: 'Frequently Asked Questions',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '3rem',
                  fontWeight: '800',
                  textAlign: 'center',
                  marginBottom: '3rem',
                  color: '#111827'
                }
              }
            },
            {
              id: generateId(),
              type: 'container',
              displayName: 'FAQ List',
              props: {},
              styles: {
                base: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'FAQ Item',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: '#F9FAFB',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Question Container',
                      props: {},
                      styles: {
                        base: {
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Question',
                          props: {
                            content: 'How does the free trial work?'
                          },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#111827'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Toggle Icon',
                          props: { content: '+' },
                          styles: {
                            base: {
                              fontSize: '1.5rem',
                              color: '#6B7280'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Answer',
                      props: {
                        content: 'Start your 14-day free trial with full access to all Professional features. No credit card required. Cancel anytime.'
                      },
                      styles: {
                        base: {
                          marginTop: '1rem',
                          color: '#6B7280',
                          lineHeight: '1.6',
                          display: 'none'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'FAQ Item',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: '#F9FAFB',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Question Container',
                      props: {},
                      styles: {
                        base: {
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Question',
                          props: {
                            content: 'Can I change plans later?'
                          },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#111827'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Toggle Icon',
                          props: { content: '+' },
                          styles: {
                            base: {
                              fontSize: '1.5rem',
                              color: '#6B7280'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Answer',
                      props: {
                        content: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.'
                      },
                      styles: {
                        base: {
                          marginTop: '1rem',
                          color: '#6B7280',
                          lineHeight: '1.6',
                          display: 'none'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'FAQ Item',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: '#F9FAFB',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'flex',
                      displayName: 'Question Container',
                      props: {},
                      styles: {
                        base: {
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Question',
                          props: {
                            content: 'What payment methods do you accept?'
                          },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#111827'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Toggle Icon',
                          props: { content: '+' },
                          styles: {
                            base: {
                              fontSize: '1.5rem',
                              color: '#6B7280'
                            }
                          }
                        }
                      ]
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Answer',
                      props: {
                        content: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for Enterprise plans.'
                      },
                      styles: {
                        base: {
                          marginTop: '1rem',
                          color: '#6B7280',
                          lineHeight: '1.6',
                          display: 'none'
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
    {
      id: generateId(),
      type: 'cta',
      displayName: 'CTA Section',
      props: {
        content: {
          heading: 'Ready to Transform Your Business?',
          description: 'Join over 10,000 companies already using CloudFlow to streamline their operations.',
          buttonText: 'Get Started Free'
        },
        animations: [{
          id: 'cta-pulse',
          name: 'Pulse',
          trigger: 'continuous',
          timeline: [],
          options: {
            duration: 2000,
            delay: 0,
            easing: 'ease-in-out',
            loop: true
          }
        }]
      },
      styles: {
        base: {
          padding: '5rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }
      }
    }
  ]
};

// Product Launch Template
export const productLaunchTemplate: Template = {
  id: 'tpl_product_launch',
  name: 'Product Launch',
  category: 'landing',
  description: 'Eye-catching product launch page with countdown timer and early access form',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMjAyYyIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNjAiIGZpbGw9IiM0Yzg4ZmYiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM0Yzg4ZmYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiM0Yzg4ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjE3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5Qcm9kdWN0IExhdW5jaDwvdGV4dD48L3N2Zz4=',
  tags: ['product', 'launch', 'countdown', 'dark', 'modern'],
  isPremium: true,
  components: [
    {
      id: generateId(),
      type: 'hero',
      displayName: 'Hero Section',
      props: {
        content: {
          heading: 'The Future is Here',
          subheading: 'Introducing the most advanced solution for modern businesses. Be among the first to experience the revolution.',
          buttonText: 'Get Early Access',
          buttonUrl: '#early-access'
        },
        animations: [{
          id: 'hero-scale',
          name: 'Scale In',
          trigger: 'onLoad',
          timeline: [],
          options: {
            duration: 1200,
            delay: 0,
            easing: 'ease-out',
            loop: false
          }
        }]
      },
      styles: {
        base: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a202c',
          color: 'white',
          textAlign: 'center',
          padding: '4rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Content Wrapper',
          props: {},
          styles: {
            base: {
              maxWidth: '800px',
              margin: '0 auto',
              position: 'relative',
              zIndex: '10'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Main Title',
              props: {
                content: 'The Future is Here',
                attributes: { level: 'h1' }
              },
              styles: {
                base: {
                  fontSize: '4rem',
                  fontWeight: '800',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(135deg, #4c88ff 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Subtitle',
              props: {
                content: 'Introducing the most advanced solution for modern businesses. Be among the first to experience the revolution.'
              },
              styles: {
                base: {
                  fontSize: '1.25rem',
                  marginBottom: '2.5rem',
                  color: '#cbd5e1',
                  lineHeight: '1.8',
                  maxWidth: '600px',
                  margin: '0 auto 2.5rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'button',
              displayName: 'CTA Button',
              props: {
                content: 'Get Early Access'
              },
              styles: {
                base: {
                  padding: '1rem 2.5rem',
                  background: 'linear-gradient(135deg, #4c88ff 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 10px 30px rgba(76, 136, 255, 0.4)'
                }
              }
            }
          ]
        }
      ]
    }
  ]
};

// Agency Landing Template
export const agencyLandingTemplate: Template = {
  id: 'tpl_agency_landing',
  name: 'Creative Agency',
  category: 'landing',
  description: 'Bold and creative agency landing page with portfolio showcase',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZjVmNSIvPjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmY2YjZiIi8+PHJlY3QgeD0iMTEwIiB5PSI0MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNGVjZGM0Ii8+PHJlY3QgeD0iMjAwIiB5PSI0MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNDU2M2ViIi8+PHRleHQgeD0iNTAlIiB5PSIxNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxYTFhMWEiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5DcmVhdGl2ZSBBZ2VuY3k8L3RleHQ+PC9zdmc+',
  tags: ['agency', 'creative', 'portfolio', 'colorful', 'modern'],
  isPremium: false,
  components: [
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Navigation',
      props: {
        content: {
          logo: 'STUDIO',
          links: [
            { text: 'Work', href: '#work' },
            { text: 'About', href: '#about' },
            { text: 'Services', href: '#services' },
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
          boxShadow: 'none',
          zIndex: '100',
          padding: '2rem 0',
          borderBottom: '1px solid #e5e7eb'
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
          backgroundColor: '#fff5f5',
          padding: '0 2rem',
          marginTop: '80px'
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
              maxWidth: '1400px',
              width: '100%',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '4rem',
              alignItems: 'center'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'container',
              displayName: 'Text Content',
              props: {},
              styles: { base: {} },
              children: [
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Main Title',
                  props: {
                    content: 'We Create Digital Experiences',
                    attributes: { level: 'h1' }
                  },
                  styles: {
                    base: {
                      fontSize: '4rem',
                      fontWeight: '800',
                      lineHeight: '1.1',
                      marginBottom: '2rem',
                      color: '#1a1a1a'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Description',
                  props: {
                    content: 'A creative studio specializing in brand design, web development, and digital marketing solutions that drive real results.'
                  },
                  styles: {
                    base: {
                      fontSize: '1.25rem',
                      color: '#4b5563',
                      lineHeight: '1.8',
                      marginBottom: '2.5rem'
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
                      gap: '1rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'button',
                      displayName: 'Primary Button',
                      props: {
                        content: 'View Our Work'
                      },
                      styles: {
                        base: {
                          padding: '1rem 2rem',
                          backgroundColor: '#ff6b6b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'button',
                      displayName: 'Secondary Button',
                      props: {
                        content: 'Get in Touch'
                      },
                      styles: {
                        base: {
                          padding: '1rem 2rem',
                          backgroundColor: 'transparent',
                          color: '#ff6b6b',
                          border: '2px solid #ff6b6b',
                          borderRadius: '4px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
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
              displayName: 'Visual Element',
              props: {},
              styles: {
                base: {
                  position: 'relative',
                  height: '600px'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Color Block 1',
                  props: {},
                  styles: {
                    base: {
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '300px',
                      height: '300px',
                      backgroundColor: '#ff6b6b',
                      borderRadius: '20px',
                      transform: 'rotate(-6deg)'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Color Block 2',
                  props: {},
                  styles: {
                    base: {
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '280px',
                      height: '280px',
                      backgroundColor: '#4ecdc4',
                      borderRadius: '20px',
                      transform: 'rotate(6deg)'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Color Block 3',
                  props: {},
                  styles: {
                    base: {
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(3deg)',
                      width: '320px',
                      height: '320px',
                      backgroundColor: '#4563eb',
                      borderRadius: '20px'
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

// Export all landing templates
export const landingTemplates = [
  saasLandingTemplate,
  productLaunchTemplate,
  agencyLandingTemplate
];
