import type { Component } from '@/types/component';

export interface SectionTemplate {
  id: string;
  name: string;
  category: 'hero' | 'features' | 'testimonials' | 'pricing' | 'faq' | 'contact' | 'about' | 'cta' | 'footer' | 'header';
  thumbnail?: string;
  variations: SectionVariation[];
  tags: string[];
}

export interface SectionVariation {
  id: string;
  name: string;
  style: 'modern' | 'classic' | 'minimal' | 'bold';
  components: Component[];
}

export const sectionTemplates: SectionTemplate[] = [
  // Hero Sections
  {
    id: 'hero-1',
    name: 'Hero with CTA',
    category: 'hero',
    tags: ['landing', 'header', 'cta'],
    variations: [
      {
        id: 'hero-1-modern',
        name: 'Modern Hero',
        style: 'modern',
        components: [
          {
            id: 'hero-section-1',
            type: 'section',
            props: {
              className: 'hero-section',
              style: {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '80px 20px'
              }
            },
            children: [
              {
                id: 'hero-container',
                type: 'container',
                props: {
                  style: {
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    alignItems: 'center'
                  }
                },
                children: [
                  {
                    id: 'hero-content',
                    type: 'div',
                    props: {
                      style: { color: 'white' }
                    },
                    children: [
                      {
                        id: 'hero-title',
                        type: 'heading',
                        props: {
                          level: 1,
                          text: 'Build Amazing Websites Without Code',
                          style: {
                            fontSize: '48px',
                            fontWeight: 'bold',
                            marginBottom: '24px',
                            lineHeight: '1.2'
                          }
                        },
                        children: []
                      },
                      {
                        id: 'hero-subtitle',
                        type: 'text',
                        props: {
                          text: 'Create professional websites in minutes with our intuitive drag-and-drop builder.',
                          style: {
                            fontSize: '20px',
                            opacity: '0.9',
                            marginBottom: '32px',
                            lineHeight: '1.6'
                          }
                        },
                        children: []
                      },
                      {
                        id: 'hero-buttons',
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap'
                          }
                        },
                        children: [
                          {
                            id: 'hero-cta-primary',
                            type: 'button',
                            props: {
                              text: 'Get Started Free',
                              style: {
                                padding: '16px 32px',
                                fontSize: '18px',
                                backgroundColor: 'white',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }
                            },
                            children: []
                          },
                          {
                            id: 'hero-cta-secondary',
                            type: 'button',
                            props: {
                              text: 'Watch Demo',
                              style: {
                                padding: '16px 32px',
                                fontSize: '18px',
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: '2px solid white',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'hero-image',
                    type: 'image',
                    props: {
                      src: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
                      alt: 'Hero Image',
                      style: {
                        width: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                      }
                    },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'hero-1-minimal',
        name: 'Minimal Hero',
        style: 'minimal',
        components: [
          {
            id: 'hero-section-minimal',
            type: 'section',
            props: {
              className: 'hero-section-minimal',
              style: {
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                padding: '80px 20px'
              }
            },
            children: [
              {
                id: 'hero-content-minimal',
                type: 'div',
                props: {
                  style: {
                    textAlign: 'center',
                    maxWidth: '800px'
                  }
                },
                children: [
                  {
                    id: 'hero-title-minimal',
                    type: 'heading',
                    props: {
                      level: 1,
                      text: 'Simple. Beautiful. Powerful.',
                      style: {
                        fontSize: '56px',
                        fontWeight: '300',
                        marginBottom: '24px',
                        color: '#111827'
                      }
                    },
                    children: []
                  },
                  {
                    id: 'hero-subtitle-minimal',
                    type: 'text',
                    props: {
                      text: 'Everything you need to build stunning websites.',
                      style: {
                        fontSize: '24px',
                        color: '#6b7280',
                        marginBottom: '48px'
                      }
                    },
                    children: []
                  },
                  {
                    id: 'hero-cta-minimal',
                    type: 'button',
                    props: {
                      text: 'Start Building →',
                      style: {
                        padding: '18px 48px',
                        fontSize: '18px',
                        backgroundColor: '#111827',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }
                    },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // Features Sections
  {
    id: 'features-1',
    name: '3-Column Features',
    category: 'features',
    tags: ['features', 'grid', 'icons'],
    variations: [
      {
        id: 'features-1-modern',
        name: 'Modern Features',
        style: 'modern',
        components: [
          {
            id: 'features-section',
            type: 'section',
            props: {
              style: {
                padding: '80px 20px',
                backgroundColor: '#f9fafb'
              }
            },
            children: [
              {
                id: 'features-container',
                type: 'container',
                props: {
                  style: {
                    maxWidth: '1200px',
                    margin: '0 auto'
                  }
                },
                children: [
                  {
                    id: 'features-header',
                    type: 'div',
                    props: {
                      style: {
                        textAlign: 'center',
                        marginBottom: '60px'
                      }
                    },
                    children: [
                      {
                        id: 'features-title',
                        type: 'heading',
                        props: {
                          level: 2,
                          text: 'Everything You Need',
                          style: {
                            fontSize: '42px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            color: '#111827'
                          }
                        },
                        children: []
                      },
                      {
                        id: 'features-subtitle',
                        type: 'text',
                        props: {
                          text: 'Build professional websites with powerful features',
                          style: {
                            fontSize: '18px',
                            color: '#6b7280'
                          }
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    id: 'features-grid',
                    type: 'div',
                    props: {
                      style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '40px'
                      }
                    },
                    children: [
                      {
                        id: 'feature-1',
                        type: 'div',
                        props: {
                          style: {
                            textAlign: 'center',
                            padding: '40px 20px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }
                        },
                        children: [
                          {
                            id: 'feature-1-icon',
                            type: 'div',
                            props: {
                              style: {
                                width: '60px',
                                height: '60px',
                                margin: '0 auto 20px',
                                backgroundColor: '#667eea',
                                borderRadius: '12px'
                              }
                            },
                            children: []
                          },
                          {
                            id: 'feature-1-title',
                            type: 'heading',
                            props: {
                              level: 3,
                              text: 'Drag & Drop Builder',
                              style: {
                                fontSize: '24px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#111827'
                              }
                            },
                            children: []
                          },
                          {
                            id: 'feature-1-desc',
                            type: 'text',
                            props: {
                              text: 'Intuitive visual editor that makes building websites a breeze.',
                              style: {
                                fontSize: '16px',
                                color: '#6b7280',
                                lineHeight: '1.6'
                              }
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        id: 'feature-2',
                        type: 'div',
                        props: {
                          style: {
                            textAlign: 'center',
                            padding: '40px 20px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }
                        },
                        children: [
                          {
                            id: 'feature-2-icon',
                            type: 'div',
                            props: {
                              style: {
                                width: '60px',
                                height: '60px',
                                margin: '0 auto 20px',
                                backgroundColor: '#10b981',
                                borderRadius: '12px'
                              }
                            },
                            children: []
                          },
                          {
                            id: 'feature-2-title',
                            type: 'heading',
                            props: {
                              level: 3,
                              text: 'Mobile Responsive',
                              style: {
                                fontSize: '24px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#111827'
                              }
                            },
                            children: []
                          },
                          {
                            id: 'feature-2-desc',
                            type: 'text',
                            props: {
                              text: 'Your websites look perfect on all devices automatically.',
                              style: {
                                fontSize: '16px',
                                color: '#6b7280',
                                lineHeight: '1.6'
                              }
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        id: 'feature-3',
                        type: 'div',
                        props: {
                          style: {
                            textAlign: 'center',
                            padding: '40px 20px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }
                        },
                        children: [
                          {
                            id: 'feature-3-icon',
                            type: 'div',
                            props: {
                              style: {
                                width: '60px',
                                height: '60px',
                                margin: '0 auto 20px',
                                backgroundColor: '#f59e0b',
                                borderRadius: '12px'
                              }
                            },
                            children: []
                          },
                          {
                            id: 'feature-3-title',
                            type: 'heading',
                            props: {
                              level: 3,
                              text: 'SEO Optimized',
                              style: {
                                fontSize: '24px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#111827'
                              }
                            },
                            children: []
                          },
                          {
                            id: 'feature-3-desc',
                            type: 'text',
                            props: {
                              text: 'Built-in SEO tools to help your site rank higher.',
                              style: {
                                fontSize: '16px',
                                color: '#6b7280',
                                lineHeight: '1.6'
                              }
                            },
                            children: []
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

  // Testimonials Section
  {
    id: 'testimonials-1',
    name: 'Customer Testimonials',
    category: 'testimonials',
    tags: ['social proof', 'reviews'],
    variations: [
      {
        id: 'testimonials-1-modern',
        name: 'Modern Testimonials',
        style: 'modern',
        components: [
          {
            id: 'testimonials-section',
            type: 'section',
            props: {
              style: {
                padding: '80px 20px',
                backgroundColor: 'white'
              }
            },
            children: [
              {
                id: 'testimonials-container',
                type: 'container',
                props: {
                  style: {
                    maxWidth: '1200px',
                    margin: '0 auto'
                  }
                },
                children: [
                  {
                    id: 'testimonials-header',
                    type: 'div',
                    props: {
                      style: {
                        textAlign: 'center',
                        marginBottom: '60px'
                      }
                    },
                    children: [
                      {
                        id: 'testimonials-title',
                        type: 'heading',
                        props: {
                          level: 2,
                          text: 'What Our Customers Say',
                          style: {
                            fontSize: '42px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            color: '#111827'
                          }
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    id: 'testimonials-grid',
                    type: 'div',
                    props: {
                      style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '30px'
                      }
                    },
                    children: [
                      {
                        id: 'testimonial-1',
                        type: 'div',
                        props: {
                          style: {
                            padding: '30px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '12px',
                            position: 'relative'
                          }
                        },
                        children: [
                          {
                            id: 'testimonial-1-quote',
                            type: 'text',
                            props: {
                              text: '"This builder has transformed how we create websites. It\'s incredibly intuitive and powerful."',
                              style: {
                                fontSize: '18px',
                                lineHeight: '1.6',
                                color: '#374151',
                                marginBottom: '24px',
                                fontStyle: 'italic'
                              }
                            },
                            children: []
                          },
                          {
                            id: 'testimonial-1-author',
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                              }
                            },
                            children: [
                              {
                                id: 'testimonial-1-avatar',
                                type: 'div',
                                props: {
                                  style: {
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: '#667eea'
                                  }
                                },
                                children: []
                              },
                              {
                                id: 'testimonial-1-info',
                                type: 'div',
                                props: {},
                                children: [
                                  {
                                    id: 'testimonial-1-name',
                                    type: 'text',
                                    props: {
                                      text: 'Sarah Johnson',
                                      style: {
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#111827'
                                      }
                                    },
                                    children: []
                                  },
                                  {
                                    id: 'testimonial-1-role',
                                    type: 'text',
                                    props: {
                                      text: 'Marketing Director',
                                      style: {
                                        fontSize: '14px',
                                        color: '#6b7280'
                                      }
                                    },
                                    children: []
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
          }
        ]
      }
    ]
  },

  // Pricing Section
  {
    id: 'pricing-1',
    name: 'Pricing Plans',
    category: 'pricing',
    tags: ['pricing', 'plans', 'subscription'],
    variations: [
      {
        id: 'pricing-1-modern',
        name: 'Modern Pricing',
        style: 'modern',
        components: [
          {
            id: 'pricing-section',
            type: 'section',
            props: {
              style: {
                padding: '80px 20px',
                backgroundColor: '#f9fafb'
              }
            },
            children: [
              {
                id: 'pricing-container',
                type: 'container',
                props: {
                  style: {
                    maxWidth: '1200px',
                    margin: '0 auto'
                  }
                },
                children: [
                  {
                    id: 'pricing-header',
                    type: 'div',
                    props: {
                      style: {
                        textAlign: 'center',
                        marginBottom: '60px'
                      }
                    },
                    children: [
                      {
                        id: 'pricing-title',
                        type: 'heading',
                        props: {
                          level: 2,
                          text: 'Choose Your Plan',
                          style: {
                            fontSize: '42px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            color: '#111827'
                          }
                        },
                        children: []
                      },
                      {
                        id: 'pricing-subtitle',
                        type: 'text',
                        props: {
                          text: 'Start free and scale as you grow',
                          style: {
                            fontSize: '18px',
                            color: '#6b7280'
                          }
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    id: 'pricing-grid',
                    type: 'div',
                    props: {
                      style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px'
                      }
                    },
                    children: [
                      {
                        id: 'pricing-card-1',
                        type: 'div',
                        props: {
                          style: {
                            padding: '40px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '2px solid transparent'
                          }
                        },
                        children: [
                          {
                            id: 'pricing-1-name',
                            type: 'heading',
                            props: {
                              level: 3,
                              text: 'Starter',
                              style: {
                                fontSize: '24px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#111827'
                              }
                            },
                            children: []
                          },
                          {
                            id: 'pricing-1-price',
                            type: 'div',
                            props: {
                              style: {
                                marginBottom: '24px'
                              }
                            },
                            children: [
                              {
                                id: 'pricing-1-amount',
                                type: 'text',
                                props: {
                                  text: '$0',
                                  style: {
                                    fontSize: '48px',
                                    fontWeight: 'bold',
                                    color: '#111827'
                                  }
                                },
                                children: []
                              },
                              {
                                id: 'pricing-1-period',
                                type: 'text',
                                props: {
                                  text: '/month',
                                  style: {
                                    fontSize: '18px',
                                    color: '#6b7280'
                                  }
                                },
                                children: []
                              }
                            ]
                          },
                          {
                            id: 'pricing-1-features',
                            type: 'div',
                            props: {
                              style: {
                                marginBottom: '32px'
                              }
                            },
                            children: [
                              {
                                id: 'pricing-1-feature-1',
                                type: 'text',
                                props: {
                                  text: '✓ 1 Website',
                                  style: {
                                    display: 'block',
                                    marginBottom: '12px',
                                    color: '#4b5563'
                                  }
                                },
                                children: []
                              },
                              {
                                id: 'pricing-1-feature-2',
                                type: 'text',
                                props: {
                                  text: '✓ Basic Templates',
                                  style: {
                                    display: 'block',
                                    marginBottom: '12px',
                                    color: '#4b5563'
                                  }
                                },
                                children: []
                              },
                              {
                                id: 'pricing-1-feature-3',
                                type: 'text',
                                props: {
                                  text: '✓ Community Support',
                                  style: {
                                    display: 'block',
                                    marginBottom: '12px',
                                    color: '#4b5563'
                                  }
                                },
                                children: []
                              }
                            ]
                          },
                          {
                            id: 'pricing-1-cta',
                            type: 'button',
                            props: {
                              text: 'Start Free',
                              style: {
                                width: '100%',
                                padding: '12px 24px',
                                backgroundColor: '#111827',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }
                            },
                            children: []
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

  // FAQ Section
  {
    id: 'faq-1',
    name: 'FAQ Accordion',
    category: 'faq',
    tags: ['faq', 'questions', 'support'],
    variations: [
      {
        id: 'faq-1-modern',
        name: 'Modern FAQ',
        style: 'modern',
        components: [
          {
            id: 'faq-section',
            type: 'section',
            props: {
              style: {
                padding: '80px 20px',
                backgroundColor: 'white'
              }
            },
            children: [
              {
                id: 'faq-container',
                type: 'container',
                props: {
                  style: {
                    maxWidth: '800px',
                    margin: '0 auto'
                  }
                },
                children: [
                  {
                    id: 'faq-header',
                    type: 'div',
                    props: {
                      style: {
                        textAlign: 'center',
                        marginBottom: '60px'
                      }
                    },
                    children: [
                      {
                        id: 'faq-title',
                        type: 'heading',
                        props: {
                          level: 2,
                          text: 'Frequently Asked Questions',
                          style: {
                            fontSize: '42px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            color: '#111827'
                          }
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    id: 'faq-list',
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }
                    },
                    children: [
                      {
                        id: 'faq-item-1',
                        type: 'div',
                        props: {
                          style: {
                            padding: '24px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }
                        },
                        children: [
                          {
                            id: 'faq-1-question',
                            type: 'heading',
                            props: {
                              level: 3,
                              text: 'How easy is it to build a website?',
                              style: {
                                fontSize: '18px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#111827'
                              }
                            },
                            children: []
                          },
                          {
                            id: 'faq-1-answer',
                            type: 'text',
                            props: {
                              text: 'Our drag-and-drop builder makes it incredibly easy. No coding required - just choose a template and customize it to your needs.',
                              style: {
                                fontSize: '16px',
                                lineHeight: '1.6',
                                color: '#6b7280'
                              }
                            },
                            children: []
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

  // Contact Section
  {
    id: 'contact-1',
    name: 'Contact Form',
    category: 'contact',
    tags: ['contact', 'form', 'get in touch'],
    variations: [
      {
        id: 'contact-1-modern',
        name: 'Modern Contact',
        style: 'modern',
        components: [
          {
            id: 'contact-section',
            type: 'section',
            props: {
              style: {
                padding: '80px 20px',
                backgroundColor: '#f9fafb'
              }
            },
            children: [
              {
                id: 'contact-container',
                type: 'container',
                props: {
                  style: {
                    maxWidth: '800px',
                    margin: '0 auto'
                  }
                },
                children: [
                  {
                    id: 'contact-header',
                    type: 'div',
                    props: {
                      style: {
                        textAlign: 'center',
                        marginBottom: '40px'
                      }
                    },
                    children: [
                      {
                        id: 'contact-title',
                        type: 'heading',
                        props: {
                          level: 2,
                          text: 'Get In Touch',
                          style: {
                            fontSize: '42px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            color: '#111827'
                          }
                        },
                        children: []
                      },
                      {
                        id: 'contact-subtitle',
                        type: 'text',
                        props: {
                          text: 'We\'d love to hear from you',
                          style: {
                            fontSize: '18px',
                            color: '#6b7280'
                          }
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    id: 'contact-form',
                    type: 'form',
                    props: {
                      style: {
                        backgroundColor: 'white',
                        padding: '40px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }
                    },
                    children: [
                      {
                        id: 'contact-name',
                        type: 'input',
                        props: {
                          type: 'text',
                          placeholder: 'Your Name',
                          style: {
                            width: '100%',
                            padding: '12px 16px',
                            marginBottom: '20px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '16px'
                          }
                        },
                        children: []
                      },
                      {
                        id: 'contact-email',
                        type: 'input',
                        props: {
                          type: 'email',
                          placeholder: 'Your Email',
                          style: {
                            width: '100%',
                            padding: '12px 16px',
                            marginBottom: '20px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '16px'
                          }
                        },
                        children: []
                      },
                      {
                        id: 'contact-message',
                        type: 'textarea',
                        props: {
                          placeholder: 'Your Message',
                          rows: 5,
                          style: {
                            width: '100%',
                            padding: '12px 16px',
                            marginBottom: '24px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '16px',
                            resize: 'vertical'
                          }
                        },
                        children: []
                      },
                      {
                        id: 'contact-submit',
                        type: 'button',
                        props: {
                          text: 'Send Message',
                          style: {
                            width: '100%',
                            padding: '14px 24px',
                            backgroundColor: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }
                        },
                        children: []
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
];

// Helper function to get templates by category
export function getTemplatesByCategory(category: string) {
  return sectionTemplates.filter(t => t.category === category);
}

// Helper function to get variation by style
export function getVariationByStyle(templateId: string, style: string) {
  const template = sectionTemplates.find(t => t.id === templateId);
  return template?.variations.find(v => v.style === style);
}