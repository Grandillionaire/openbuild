import type { Template } from '@/types/template';
import { nanoid } from 'nanoid';

// Helper function to generate IDs
function generateId() {
  return nanoid(8);
}

// Tech Blog Template
export const techBlogTemplate: Template = {
  id: 'tpl_tech_blog',
  name: 'Tech Blog',
  category: 'blog',
  description: 'Modern tech blog with syntax highlighting and dark mode',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMWExYSIvPjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzMzMyIvPjxyZWN0IHg9IjIwIiB5PSI2MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzMzMyIvPjxyZWN0IHg9IjIwIiB5PSI5MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIzMCIgZmlsbD0iIzNiODJmNiIgcng9IjQiLz48cmVjdCB4PSIyMCIgeT0iMTQwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIyMCIgcj0iNSIgZmlsbD0iIzNiODJmNiIvPjwvc3ZnPg==',
  tags: ['blog', 'tech', 'dark', 'modern', 'developer'],
  isPremium: false,
  components: [
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Navigation',
      props: {
        content: {
          logo: 'DevBlog',
          links: [
            { text: 'Articles', href: '#articles' },
            { text: 'Tutorials', href: '#tutorials' },
            { text: 'About', href: '#about' },
            { text: 'Newsletter', href: '#newsletter' }
          ]
        }
      },
      styles: {
        base: {
          position: 'sticky',
          top: '0',
          backgroundColor: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #333',
          zIndex: '100',
          padding: '1rem 0'
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
          backgroundColor: '#1a1a1a',
          color: '#fff',
          padding: '6rem 2rem 4rem',
          textAlign: 'center'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'heading',
          displayName: 'Main Title',
          props: {
            content: 'Code, Create, Share',
            attributes: { level: 'h1' }
          },
          styles: {
            base: {
              fontSize: '3.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }
          }
        },
        {
          id: generateId(),
          type: 'text',
          displayName: 'Tagline',
          props: {
            content: 'Deep dives into web development, programming, and technology'
          },
          styles: {
            base: {
              fontSize: '1.25rem',
              color: '#9ca3af',
              maxWidth: '600px',
              margin: '0 auto'
            }
          }
        }
      ]
    },
    {
      id: generateId(),
      type: 'section',
      displayName: 'Featured Post',
      props: {},
      styles: {
        base: {
          backgroundColor: '#0a0a0a',
          padding: '4rem 2rem'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'container',
          displayName: 'Featured Container',
          props: {},
          styles: {
            base: {
              maxWidth: '1200px',
              margin: '0 auto',
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #333'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Featured Grid',
              props: {
                content: { columns: 2, gap: '0' }
              },
              styles: { base: {} },
              children: [
                {
                  id: generateId(),
                  type: 'image',
                  displayName: 'Featured Image',
                  props: {
                    attributes: {
                      src: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
                      alt: 'Code on screen'
                    }
                  },
                  styles: {
                    base: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Featured Content',
                  props: {},
                  styles: {
                    base: {
                      padding: '3rem'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Featured Label',
                      props: {
                        content: 'FEATURED POST'
                      },
                      styles: {
                        base: {
                          fontSize: '0.75rem',
                          color: '#3b82f6',
                          letterSpacing: '0.1rem',
                          marginBottom: '1rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'heading',
                      displayName: 'Post Title',
                      props: {
                        content: 'Building Scalable Web Applications with Next.js 14',
                        attributes: { level: 'h2' }
                      },
                      styles: {
                        base: {
                          fontSize: '2rem',
                          color: '#fff',
                          marginBottom: '1rem',
                          lineHeight: '1.3'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'text',
                      displayName: 'Post Excerpt',
                      props: {
                        content: 'Learn how to leverage the latest features in Next.js 14 to build performant, scalable web applications with server components and improved caching strategies.'
                      },
                      styles: {
                        base: {
                          color: '#9ca3af',
                          lineHeight: '1.6',
                          marginBottom: '1.5rem'
                        }
                      }
                    },
                    {
                      id: generateId(),
                      type: 'link',
                      displayName: 'Read More Link',
                      props: {
                        content: 'Read Article →',
                        attributes: { href: '#' }
                      },
                      styles: {
                        base: {
                          color: '#3b82f6',
                          textDecoration: 'none',
                          fontSize: '1rem',
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
    },
    // Recent Posts Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Recent Posts',
      props: {},
      styles: {
        base: {
          backgroundColor: '#0F172A',
          padding: '5rem 2rem'
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
                content: 'Recent Articles',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#E0E7FF',
                  marginBottom: '3rem',
                  textAlign: 'center'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Posts Grid',
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
                  displayName: 'Post Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: '#1a1a1a',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #333',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Post Content',
                      props: {},
                      styles: {
                        base: {
                          padding: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Category',
                          props: {
                            content: 'JavaScript'
                          },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#3b82f6',
                              letterSpacing: '0.1rem',
                              marginBottom: '1rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Post Title',
                          props: {
                            content: 'Understanding React Server Components',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.5rem',
                              fontWeight: '600',
                              color: '#E0E7FF',
                              marginBottom: '1rem',
                              lineHeight: '1.3'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Post Excerpt',
                          props: {
                            content: 'A deep dive into React Server Components, how they work, and when to use them in your applications.'
                          },
                          styles: {
                            base: {
                              color: '#9ca3af',
                              lineHeight: '1.6',
                              marginBottom: '1.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Post Meta',
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
                              displayName: 'Date',
                              props: {
                                content: '5 min read • Dec 10, 2023'
                              },
                              styles: {
                                base: {
                                  fontSize: '0.875rem',
                                  color: '#6b7280'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'link',
                              displayName: 'Read More',
                              props: {
                                content: 'Read →',
                                attributes: { href: '#' }
                              },
                              styles: {
                                base: {
                                  color: '#3b82f6',
                                  textDecoration: 'none',
                                  fontSize: '0.875rem',
                                  fontWeight: '500'
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
                  displayName: 'Post Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: '#1a1a1a',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #333',
                      transition: 'transform 0.3s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'container',
                      displayName: 'Post Content',
                      props: {},
                      styles: {
                        base: {
                          padding: '2rem'
                        }
                      },
                      children: [
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Category',
                          props: {
                            content: 'TypeScript'
                          },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#3b82f6',
                              letterSpacing: '0.1rem',
                              marginBottom: '1rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Post Title',
                          props: {
                            content: 'Advanced TypeScript Patterns',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.5rem',
                              fontWeight: '600',
                              color: '#E0E7FF',
                              marginBottom: '1rem',
                              lineHeight: '1.3'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Post Excerpt',
                          props: {
                            content: 'Explore advanced TypeScript patterns including discriminated unions, conditional types, and mapped types.'
                          },
                          styles: {
                            base: {
                              color: '#9ca3af',
                              lineHeight: '1.6',
                              marginBottom: '1.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'flex',
                          displayName: 'Post Meta',
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
                              displayName: 'Date',
                              props: {
                                content: '8 min read • Dec 8, 2023'
                              },
                              styles: {
                                base: {
                                  fontSize: '0.875rem',
                                  color: '#6b7280'
                                }
                              }
                            },
                            {
                              id: generateId(),
                              type: 'link',
                              displayName: 'Read More',
                              props: {
                                content: 'Read →',
                                attributes: { href: '#' }
                              },
                              styles: {
                                base: {
                                  color: '#3b82f6',
                                  textDecoration: 'none',
                                  fontSize: '0.875rem',
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
            }
          ]
        }
      ]
    },
    // Newsletter Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Newsletter CTA',
      props: {},
      styles: {
        base: {
          backgroundColor: '#1E293B',
          padding: '4rem 2rem'
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
                content: 'Stay Updated',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#E0E7FF',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Newsletter Description',
              props: {
                content: 'Get the latest articles on web development, programming tips, and tech news delivered to your inbox.'
              },
              styles: {
                base: {
                  fontSize: '1.125rem',
                  color: '#94A3B8',
                  marginBottom: '2.5rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'button',
              displayName: 'Subscribe Button',
              props: {
                content: 'Subscribe to Newsletter'
              },
              styles: {
                base: {
                  padding: '1rem 2.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
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
          links: ['About', 'Archive', 'RSS Feed', 'GitHub', 'Twitter'],
          copyright: '© 2024 DevBlog. All rights reserved.'
        }
      },
      styles: {
        base: {
          backgroundColor: '#0a0a0a',
          padding: '3rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid #333',
          color: '#9ca3af'
        }
      }
    }
  ]
};

// Personal Blog Template
export const personalBlogTemplate: Template = {
  id: 'tpl_personal_blog',
  name: 'Personal Blog',
  category: 'blog',
  description: 'Clean and minimal personal blog with focus on readability',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZmRmOCIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjYwIiByPSIyNSIgZmlsbD0iI2Y1OWU0MiIvPjxyZWN0IHg9IjYwIiB5PSIxMDAiIHdpZHRoPSIxODAiIGhlaWdodD0iOCIgZmlsbD0iI2U1ZTdlYiIvPjxyZWN0IHg9IjYwIiB5PSIxMjAiIHdpZHRoPSIxNDAiIGhlaWdodD0iOCIgZmlsbD0iI2U1ZTdlYiIvPjxyZWN0IHg9IjYwIiB5PSIxNDAiIHdpZHRoPSIxNjAiIGhlaWdodD0iOCIgZmlsbD0iI2U1ZTdlYiIvPjwvc3ZnPg==',
  tags: ['blog', 'personal', 'minimal', 'clean', 'writing'],
  isPremium: false,
  components: [
    {
      id: generateId(),
      type: 'section',
      displayName: 'Header Section',
      props: {},
      styles: {
        base: {
          backgroundColor: '#fffdf8',
          padding: '4rem 2rem',
          borderBottom: '1px solid #e5e7eb'
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
              textAlign: 'center'
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
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e42',
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
                  props: { content: 'JD' },
                  styles: {
                    base: {
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '600'
                    }
                  }
                }
              ]
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Blog Title',
              props: {
                content: 'Thoughts & Reflections',
                attributes: { level: 'h1' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '400',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Tagline',
              props: {
                content: 'A personal journal about life, philosophy, and everything in between'
              },
              styles: {
                base: {
                  color: '#6b7280',
                  fontSize: '1.125rem'
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
          backgroundColor: '#fafaf9',
          minHeight: '60vh',
          padding: '4rem 2rem'
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
              margin: '0 auto'
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
                  marginBottom: '4rem',
                  paddingBottom: '4rem',
                  borderBottom: '1px solid #e5e7eb'
                }
              },
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Post Date',
                  props: {
                    content: 'December 15, 2023'
                  },
                  styles: {
                    base: {
                      fontSize: '0.875rem',
                      color: '#9ca3af',
                      marginBottom: '0.5rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'heading',
                  displayName: 'Post Title',
                  props: {
                    content: 'Finding Balance in a Digital World',
                    attributes: { level: 'h2' }
                  },
                  styles: {
                    base: {
                      fontSize: '1.875rem',
                      color: '#1f2937',
                      marginBottom: '1rem',
                      fontWeight: '600'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'text',
                  displayName: 'Post Excerpt',
                  props: {
                    content: 'In our increasingly connected world, finding moments of genuine peace and reflection has become both more challenging and more essential. This week, I\'ve been exploring different approaches to digital minimalism...'
                  },
                  styles: {
                    base: {
                      color: '#4b5563',
                      lineHeight: '1.8',
                      marginBottom: '1rem'
                    }
                  }
                },
                {
                  id: generateId(),
                  type: 'link',
                  displayName: 'Continue Reading',
                  props: {
                    content: 'Continue reading',
                    attributes: { href: '#' }
                  },
                  styles: {
                    base: {
                      color: '#f59e42',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
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

// Magazine Blog Template
export const magazineBlogTemplate: Template = {
  id: 'tpl_magazine_blog',
  name: 'Digital Magazine',
  category: 'blog',
  description: 'Bold magazine-style blog with featured articles and categories',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlZjQ0NDQiLz48cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjZjNmNGY2Ii8+PHJlY3QgeD0iMjAwIiB5PSI2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjU1IiBmaWxsPSIjZjNmNGY2Ii8+PHJlY3QgeD0iMjAwIiB5PSIxMjUiIHdpZHRoPSI4MCIgaGVpZ2h0PSI1NSIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==',
  tags: ['blog', 'magazine', 'news', 'editorial', 'bold'],
  isPremium: true,
  components: [
    {
      id: generateId(),
      type: 'navigation',
      displayName: 'Magazine Header',
      props: {
        content: {
          logo: 'THE DIGEST',
          links: [
            { text: 'Politics', href: '#politics' },
            { text: 'Culture', href: '#culture' },
            { text: 'Tech', href: '#tech' },
            { text: 'Opinion', href: '#opinion' },
            { text: 'Subscribe', href: '#subscribe' }
          ]
        }
      },
      styles: {
        base: {
          backgroundColor: '#ef4444',
          color: 'white',
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
      displayName: 'Featured Article',
      props: {},
      styles: {
        base: {
          backgroundColor: '#1a1a1a',
          color: 'white',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }
      },
      children: [
        {
          id: generateId(),
          type: 'image',
          displayName: 'Background Image',
          props: {
            attributes: {
              src: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1920&h=1080&fit=crop',
              alt: 'Featured article'
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
              opacity: '0.3'
            }
          }
        },
        {
          id: generateId(),
          type: 'container',
          displayName: 'Featured Content',
          props: {},
          styles: {
            base: {
              position: 'relative',
              zIndex: '10',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 2rem'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'text',
              displayName: 'Category',
              props: {
                content: 'BREAKING NEWS'
              },
              styles: {
                base: {
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '0.1rem',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'heading',
              displayName: 'Featured Title',
              props: {
                content: 'The Future of Digital Journalism in Modern Media',
                attributes: { level: 'h1' }
              },
              styles: {
                base: {
                  fontSize: '4rem',
                  fontWeight: '800',
                  lineHeight: '1.1',
                  marginBottom: '1.5rem',
                  maxWidth: '900px'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'Author & Date',
              props: {
                content: 'By Sarah Johnson • December 15, 2023'
              },
              styles: {
                base: {
                  fontSize: '1rem',
                  opacity: '0.8'
                }
              }
            }
          ]
        }
      ]
    },
    // Articles Grid Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Articles Grid',
      props: {},
      styles: {
        base: {
          padding: '4rem 2rem',
          backgroundColor: '#f9f9f9'
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
                content: 'Latest Stories',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '3rem',
                  color: '#1a1a1a'
                }
              }
            },
            {
              id: generateId(),
              type: 'grid',
              displayName: 'Articles Grid',
              props: {
                content: { columns: 3, gap: '2rem' }
              },
              styles: {
                base: {}
              },
              children: [
                {
                  id: generateId(),
                  type: 'container',
                  displayName: 'Article Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'image',
                      displayName: 'Article Image',
                      props: {
                        attributes: {
                          src: 'https://images.unsplash.com/photo-1585241936939-be4099591252?w=400&h=250&fit=crop',
                          alt: 'Article image'
                        }
                      },
                      styles: {
                        base: {
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
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
                          props: { content: 'POLITICS' },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#ef4444',
                              fontWeight: '600',
                              letterSpacing: '0.05rem',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Article Title',
                          props: {
                            content: 'Understanding the New Climate Policy',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.25rem',
                              fontWeight: '600',
                              marginBottom: '0.75rem',
                              color: '#1a1a1a',
                              lineHeight: '1.4'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Article Date',
                          props: {
                            content: 'December 14, 2023'
                          },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              color: '#666'
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
                  displayName: 'Article Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'image',
                      displayName: 'Article Image',
                      props: {
                        attributes: {
                          src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop',
                          alt: 'Article image'
                        }
                      },
                      styles: {
                        base: {
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
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
                          props: { content: 'CULTURE' },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#ef4444',
                              fontWeight: '600',
                              letterSpacing: '0.05rem',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Article Title',
                          props: {
                            content: 'The Rise of Digital Art Galleries',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.25rem',
                              fontWeight: '600',
                              marginBottom: '0.75rem',
                              color: '#1a1a1a',
                              lineHeight: '1.4'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Article Date',
                          props: {
                            content: 'December 13, 2023'
                          },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              color: '#666'
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
                  displayName: 'Article Card',
                  props: {},
                  styles: {
                    base: {
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s'
                    }
                  },
                  children: [
                    {
                      id: generateId(),
                      type: 'image',
                      displayName: 'Article Image',
                      props: {
                        attributes: {
                          src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=250&fit=crop',
                          alt: 'Article image'
                        }
                      },
                      styles: {
                        base: {
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
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
                          props: { content: 'TECH' },
                          styles: {
                            base: {
                              fontSize: '0.75rem',
                              color: '#ef4444',
                              fontWeight: '600',
                              letterSpacing: '0.05rem',
                              marginBottom: '0.5rem'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'heading',
                          displayName: 'Article Title',
                          props: {
                            content: 'Digital Revolution in Healthcare',
                            attributes: { level: 'h3' }
                          },
                          styles: {
                            base: {
                              fontSize: '1.25rem',
                              fontWeight: '600',
                              marginBottom: '0.75rem',
                              color: '#1a1a1a',
                              lineHeight: '1.4'
                            }
                          }
                        },
                        {
                          id: generateId(),
                          type: 'text',
                          displayName: 'Article Date',
                          props: {
                            content: 'December 12, 2023'
                          },
                          styles: {
                            base: {
                              fontSize: '0.875rem',
                              color: '#666'
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
    // Newsletter CTA Section
    {
      id: generateId(),
      type: 'section',
      displayName: 'Newsletter CTA',
      props: {},
      styles: {
        base: {
          backgroundColor: '#1a1a1a',
          color: 'white',
          padding: '4rem 2rem',
          textAlign: 'center'
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
              margin: '0 auto'
            }
          },
          children: [
            {
              id: generateId(),
              type: 'heading',
              displayName: 'CTA Title',
              props: {
                content: 'Never Miss a Story',
                attributes: { level: 'h2' }
              },
              styles: {
                base: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '1rem'
                }
              }
            },
            {
              id: generateId(),
              type: 'text',
              displayName: 'CTA Description',
              props: {
                content: 'Get the latest news and analysis delivered to your inbox'
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
              displayName: 'Subscribe Button',
              props: {
                content: 'Subscribe Now'
              },
              styles: {
                base: {
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '1rem 3rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
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
          links: ['About', 'Contact', 'Privacy Policy', 'Terms', 'Careers', 'Advertise'],
          copyright: '© 2024 The Digest. All rights reserved.'
        }
      },
      styles: {
        base: {
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '3rem 2rem',
          textAlign: 'center'
        }
      }
    }
  ]
};

// Export all blog templates
export const blogTemplates = [
  techBlogTemplate,
  personalBlogTemplate,
  magazineBlogTemplate
];