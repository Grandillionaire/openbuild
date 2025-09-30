import type { Template } from '@/types/template';
import { nanoid } from 'nanoid';

// Helper function to generate IDs
function generateId() {
  return nanoid(8);
}

// Modern E-commerce Template
export const ecommerceTemplate: Template = {
  id: 'tpl_ecommerce_modern',
  name: 'Modern E-commerce',
  category: 'ecommerce',
  description: 'Complete e-commerce template with product grid, cart, and checkout',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRTVFN0VCIiByeD0iOCIvPjxyZWN0IHg9IjkwIiB5PSI0MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRTVFN0VCIiByeD0iOCIvPjxyZWN0IHg9IjE2MCIgeT0iNDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI0U1RTdFQiIgcng9IjgiLz48cmVjdCB4PSIyMzAiIHk9IjQwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNFNUU3RUIiIHJ4PSI4Ii8+PHRleHQgeD0iNTAlIiB5PSIxNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxMTExMTEiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNjAwIj5FLWNvbW1lcmNlPC90ZXh0Pjwvc3ZnPg==',
  tags: ['ecommerce', 'shop', 'store', 'products', 'modern', 'retail'],
  isPremium: false,
  components: [
    // Navigation with Cart
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Navigation',
      props: {
        content: {
          logo: 'ShopFlow',
          links: [
            { text: 'New Arrivals', href: '#new' },
            { text: 'Categories', href: '#categories' },
            { text: 'Sale', href: '#sale' },
            { text: 'About', href: '#about' }
          ]
        }
      },
      styles: {
        base: {
          position: 'sticky',
          top: '0',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          zIndex: '1000',
          padding: '1rem 2rem'
        }
      }
    },
    // Hero Banner
    {
      id: generateId(),
      type: 'section',
      displayName: 'Hero Banner',
      props: {},
      styles: {
        base: {
          minHeight: '70vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '4rem 2rem'
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
              displayName: 'Text Content',
              props: {},
              styles: {
                base: {}
              },
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Badge',
                  props: {
                    content: 'SUMMER COLLECTION 2024'
                  },
                  styles: {
                    base: {
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Hero Title',
                  props: {
                    content: 'Discover Your Perfect Style',
                    attributes: { level: 'h1' }
                  },
                  styles: {
                    base: {
                      fontSize: '3.5rem',
                      fontWeight: '800',
                      color: 'white',
                      lineHeight: '1.1',
                      marginBottom: '1.5rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Description',
                  props: {
                    content: 'Shop the latest trends with exclusive discounts. Free shipping on orders over $50.'
                  },
                  styles: {
                    base: {
                      fontSize: '1.25rem',
                      color: 'rgba(255,255,255,0.95)',
                      lineHeight: '1.6',
                      marginBottom: '2rem'
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
                      displayName: 'Shop Now Button',
                      props: {
                        content: 'Shop Now'
                      },
                      styles: {
                        base: {
                          padding: '1rem 2rem',
                          backgroundColor: 'white',
                          color: '#667eea',
                          border: 'none',
                          borderRadius: '50px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'button',
                      displayName: 'View Catalog Button',
                      props: {
                        content: 'View Catalog'
                      },
                      styles: {
                        base: {
                          padding: '1rem 2rem',
                          backgroundColor: 'transparent',
                          color: 'white',
                          border: '2px solid white',
                          borderRadius: '50px',
                          fontSize: '1rem',
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
            {
              id: generateId(),
              type: 'container',
              displayName: 'Hero Image',
              props: {},
              styles: {
                base: {
                  width: '100%',
                  height: '500px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Image Placeholder',
                  props: {
                    content: 'Hero Product Image'
                  },
                  styles: {
                    base: {
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '1.5rem'
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    // Product Categories
    {
      id: generateId(),
      type: 'section',
      displayName: 'Categories Section',
      props: {},
      styles: {
        base: {
          padding: '5rem 2rem',
          backgroundColor: '#F9FAFB'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Categories Container',
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
                content: 'Shop by Category',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: '3rem',
                  color: '#111827'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Categories Grid',
              props: {},
              styles: {
                base: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '2rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Category Card',
                  props: {},
                  styles: {
                    base: {
                      position: 'relative',
                      height: '300px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Category Content',
                      props: {},
                      styles: {
                        base: {
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          right: '0',
                          padding: '2rem',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Category Name',
                          props: {
                            content: "Women's Fashion",
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.5rem',
                              fontWeight: '600',
                              color: 'white',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Item Count',
                          props: {
                            content: '250+ items'
                          },
                          styles: {
                            base: {
                              color: 'rgba(255,255,255,0.9)',
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
                  displayName: 'Category Card',
                  props: {},
                  styles: {
                    base: {
                      position: 'relative',
                      height: '300px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Category Content',
                      props: {},
                      styles: {
                        base: {
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          right: '0',
                          padding: '2rem',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Category Name',
                          props: {
                            content: "Men's Collection",
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.5rem',
                              fontWeight: '600',
                              color: 'white',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Item Count',
                          props: {
                            content: '180+ items'
                          },
                          styles: {
                            base: {
                              color: 'rgba(255,255,255,0.9)',
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
                  displayName: 'Category Card',
                  props: {},
                  styles: {
                    base: {
                      position: 'relative',
                      height: '300px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Category Content',
                      props: {},
                      styles: {
                        base: {
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          right: '0',
                          padding: '2rem',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Category Name',
                          props: {
                            content: 'Accessories',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.5rem',
                              fontWeight: '600',
                              color: 'white',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Item Count',
                          props: {
                            content: '120+ items'
                          },
                          styles: {
                            base: {
                              color: 'rgba(255,255,255,0.9)',
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
                  displayName: 'Category Card',
                  props: {},
                  styles: {
                    base: {
                      position: 'relative',
                      height: '300px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Category Content',
                      props: {},
                      styles: {
                        base: {
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          right: '0',
                          padding: '2rem',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Category Name',
                          props: {
                            content: 'Footwear',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.5rem',
                              fontWeight: '600',
                              color: 'white',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Item Count',
                          props: {
                            content: '90+ items'
                          },
                          styles: {
                            base: {
                              color: 'rgba(255,255,255,0.9)',
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
    // Featured Products
    {
      id: generateId(),
      type: 'section',
      displayName: 'Featured Products',
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
              type: 'flex',
              displayName: 'Section Header',
              props: {},
              styles: {
                base: {
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '3rem'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Section Title',
                  props: {
                    content: 'Featured Products',
                    attributes: { level: 'h2' }
                  },
                  styles: {
                    base: {
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      color: '#111827'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'View All Button',
                  props: {
                    content: 'View All Products'
                  },
                  styles: {
                    base: {
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'transparent',
                      color: '#667eea',
                      border: '2px solid #667eea',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
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
              type: 'grid',
              displayName: 'Products Grid',
              props: {},
              styles: {
                base: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '2rem'
                }
              },
              children: [
                // Product Card 1
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Product Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
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
                          width: '100%',
                          height: '320px',
                          backgroundColor: '#F3F4F6',
                          position: 'relative'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Sale Badge',
                          props: {},
                          styles: {
                            base: {
                              position: 'absolute',
                              top: '1rem',
                              left: '1rem',
                              backgroundColor: '#EF4444',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Badge Text',
                              props: { content: '-30%' },
                              styles: { base: {} }
                            }
                          ]
                        }
                      ]
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
                          type: 'text',
                          displayName: 'Brand',
                          props: { content: 'PREMIUM BRAND' },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontWeight: '600',
                              letterSpacing: '0.05em',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Product Name',
                          props: {
                            content: 'Classic Designer Watch',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#111827',
                              marginBottom: '0.5rem'
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
                              alignItems: 'center',
                              gap: '0.75rem',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Current Price',
                              props: { content: '$129.99' },
                              styles: {
                                base: {
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                  color: '#111827'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Original Price',
                              props: { content: '$189.99' },
                              styles: {
                                base: {
                                  fontSize: '1rem',
                                  color: '#9CA3AF',
                                  textDecoration: 'line-through'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'button',
                          displayName: 'Add to Cart',
                          props: {
                            content: 'Add to Cart'
                          },
                          styles: {
                            base: {
                              width: '100%',
                              padding: '0.75rem',
                              backgroundColor: '#111827',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
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
                // Product Card 2
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Product Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
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
                          width: '100%',
                          height: '320px',
                          backgroundColor: '#F3F4F6',
                          position: 'relative'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'New Badge',
                          props: {},
                          styles: {
                            base: {
                              position: 'absolute',
                              top: '1rem',
                              left: '1rem',
                              backgroundColor: '#10B981',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Badge Text',
                              props: { content: 'NEW' },
                              styles: { base: {} }
                            }
                          ]
                        }
                      ]
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
                          type: 'text',
                          displayName: 'Brand',
                          props: { content: 'LUXURY COLLECTION' },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontWeight: '600',
                              letterSpacing: '0.05em',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Product Name',
                          props: {
                            content: 'Premium Leather Bag',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#111827',
                              marginBottom: '0.5rem'
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
                              alignItems: 'center',
                              gap: '0.75rem',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Current Price',
                              props: { content: '$249.99' },
                              styles: {
                                base: {
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                  color: '#111827'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'button',
                          displayName: 'Add to Cart',
                          props: {
                            content: 'Add to Cart'
                          },
                          styles: {
                            base: {
                              width: '100%',
                              padding: '0.75rem',
                              backgroundColor: '#111827',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
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
                // Product Card 3
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Product Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
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
                          width: '100%',
                          height: '320px',
                          backgroundColor: '#F3F4F6',
                          position: 'relative'
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
                          type: 'text',
                          displayName: 'Brand',
                          props: { content: 'CASUAL STYLE' },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontWeight: '600',
                              letterSpacing: '0.05em',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Product Name',
                          props: {
                            content: 'Comfortable Sneakers',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#111827',
                              marginBottom: '0.5rem'
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
                              alignItems: 'center',
                              gap: '0.75rem',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Current Price',
                              props: { content: '$89.99' },
                              styles: {
                                base: {
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                  color: '#111827'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'button',
                          displayName: 'Add to Cart',
                          props: {
                            content: 'Add to Cart'
                          },
                          styles: {
                            base: {
                              width: '100%',
                              padding: '0.75rem',
                              backgroundColor: '#111827',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
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
                // Product Card 4
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Product Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
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
                          width: '100%',
                          height: '320px',
                          backgroundColor: '#F3F4F6',
                          position: 'relative'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'container',
                          displayName: 'Hot Badge',
                          props: {},
                          styles: {
                            base: {
                              position: 'absolute',
                              top: '1rem',
                              left: '1rem',
                              backgroundColor: '#F59E0B',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Badge Text',
                              props: { content: 'HOT' },
                              styles: { base: {} }
                            }
                          ]
                        }
                      ]
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
                          type: 'text',
                          displayName: 'Brand',
                          props: { content: 'TRENDING NOW' },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontWeight: '600',
                              letterSpacing: '0.05em',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Product Name',
                          props: {
                            content: 'Stylish Sunglasses',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#111827',
                              marginBottom: '0.5rem'
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
                              alignItems: 'center',
                              gap: '0.75rem',
                              marginBottom: '1rem'
                            }
                          },
                          children: [
                            {
                              id: generateId(),
                              type: 'text',
                              displayName: 'Current Price',
                              props: { content: '$59.99' },
                              styles: {
                                base: {
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                  color: '#111827'
                                }
                              }
                            }
                          ]
                        },
                        {
                          id: generateId(),
                          type: 'button',
                          displayName: 'Add to Cart',
                          props: {
                            content: 'Add to Cart'
                          },
                          styles: {
                            base: {
                              width: '100%',
                              padding: '0.75rem',
                              backgroundColor: '#111827',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
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
        }
      ]
    },
    // Newsletter Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Newsletter',
      props: {},
      styles: {
        base: {
          padding: '5rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Newsletter Container',
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
              id: generateId(),
              type: 'heading',
              displayName: 'Newsletter Title',
              props: {
                content: 'Get 15% Off Your First Order',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Newsletter Description',
              props: {
                content: 'Subscribe to our newsletter and be the first to know about new arrivals and exclusive offers.'
              },
              styles: {
                base: {
                  fontSize: '1.125rem',
                  color: 'rgba(255,255,255,0.95)',
                  marginBottom: '2rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'flex',
              displayName: 'Email Form',
              props: {},
              styles: {
                base: {
                  gap: '1rem',
                  justifyContent: 'center'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Email Input',
                  props: {},
                  styles: {
                    base: {
                      flex: '1',
                      maxWidth: '400px'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Input Placeholder',
                      props: {
                        content: 'Enter your email'
                      },
                      styles: {
                        base: {
                          width: '100%',
                          padding: '1rem',
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          borderRadius: '50px',
                          border: 'none',
                          fontSize: '1rem'
                        }
                      }
                    }
                  ]
                },
                {
                  id: generateId(),
                  type: 'button',
                  displayName: 'Subscribe Button',
                  props: {
                    content: 'Subscribe'
                  },
                  styles: {
                    base: {
                      padding: '1rem 2rem',
                      backgroundColor: '#111827',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '1rem',
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
    },
    // Footer
    {
      id: generateId(),
      type: 'footer',
      displayName: 'Footer',
      props: {
        content: {
          copyright: '© 2024 ShopFlow. All rights reserved.',
          links: [
            { text: 'Privacy Policy', href: '/privacy' },
            { text: 'Terms of Service', href: '/terms' },
            { text: 'Shipping Info', href: '/shipping' },
            { text: 'Returns', href: '/returns' }
          ]
        }
      },
      styles: {
        base: {
          padding: '4rem 2rem 2rem',
          backgroundColor: '#111827',
          color: '#9CA3AF'
        }
      }
    }
  ]
};

// Export e-commerce template
export const ecommerceTemplates = [ecommerceTemplate];