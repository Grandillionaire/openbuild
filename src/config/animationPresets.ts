import type { Animation } from '@/types/component';
import { nanoid } from 'nanoid';

export interface AnimationPreset {
  id: string;
  name: string;
  category: 'entrance' | 'emphasis' | 'exit' | 'hover' | 'continuous';
  animation: Omit<Animation, 'id'>;
}

export const animationPresets: AnimationPreset[] = [
  // Entrance Animations
  {
    id: 'fade-in',
    name: 'Fade In',
    category: 'entrance',
    animation: {
      name: 'Fade In',
      trigger: 'onLoad',
      timeline: [
        {
          time: 0,
          properties: {
            opacity: 0
          }
        },
        {
          time: 1,
          properties: {
            opacity: 1
          }
        }
      ],
      options: {
        duration: 800,
        delay: 0,
        easing: 'ease-out'
      }
    }
  },
  {
    id: 'slide-in-left',
    name: 'Slide In Left',
    category: 'entrance',
    animation: {
      name: 'Slide In Left',
      trigger: 'onLoad',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'translateX(-100px)',
            opacity: 0
          }
        },
        {
          time: 1,
          properties: {
            transform: 'translateX(0)',
            opacity: 1
          }
        }
      ],
      options: {
        duration: 800,
        delay: 0,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  {
    id: 'slide-in-right',
    name: 'Slide In Right',
    category: 'entrance',
    animation: {
      name: 'Slide In Right',
      trigger: 'onLoad',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'translateX(100px)',
            opacity: 0
          }
        },
        {
          time: 1,
          properties: {
            transform: 'translateX(0)',
            opacity: 1
          }
        }
      ],
      options: {
        duration: 800,
        delay: 0,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  {
    id: 'slide-in-up',
    name: 'Slide In Up',
    category: 'entrance',
    animation: {
      name: 'Slide In Up',
      trigger: 'onLoad',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'translateY(50px)',
            opacity: 0
          }
        },
        {
          time: 1,
          properties: {
            transform: 'translateY(0)',
            opacity: 1
          }
        }
      ],
      options: {
        duration: 800,
        delay: 0,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  {
    id: 'scale-in',
    name: 'Scale In',
    category: 'entrance',
    animation: {
      name: 'Scale In',
      trigger: 'onLoad',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'scale(0.8)',
            opacity: 0
          }
        },
        {
          time: 1,
          properties: {
            transform: 'scale(1)',
            opacity: 1
          }
        }
      ],
      options: {
        duration: 600,
        delay: 0,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  {
    id: 'rotate-in',
    name: 'Rotate In',
    category: 'entrance',
    animation: {
      name: 'Rotate In',
      trigger: 'onLoad',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'rotate(-180deg) scale(0.8)',
            opacity: 0
          }
        },
        {
          time: 1,
          properties: {
            transform: 'rotate(0deg) scale(1)',
            opacity: 1
          }
        }
      ],
      options: {
        duration: 1000,
        delay: 0,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  
  // Emphasis Animations
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'emphasis',
    animation: {
      name: 'Pulse',
      trigger: 'continuous',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'scale(1)'
          }
        },
        {
          time: 0.5,
          properties: {
            transform: 'scale(1.05)'
          }
        },
        {
          time: 1,
          properties: {
            transform: 'scale(1)'
          }
        }
      ],
      options: {
        duration: 1500,
        delay: 0,
        easing: 'ease-in-out',
        loop: true
      }
    }
  },
  {
    id: 'bounce',
    name: 'Bounce',
    category: 'emphasis',
    animation: {
      name: 'Bounce',
      trigger: 'onHover',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'translateY(0)'
          }
        },
        {
          time: 0.4,
          properties: {
            transform: 'translateY(-20px)'
          }
        },
        {
          time: 0.6,
          properties: {
            transform: 'translateY(0)'
          }
        },
        {
          time: 0.8,
          properties: {
            transform: 'translateY(-10px)'
          }
        },
        {
          time: 1,
          properties: {
            transform: 'translateY(0)'
          }
        }
      ],
      options: {
        duration: 800,
        delay: 0,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    }
  },
  {
    id: 'shake',
    name: 'Shake',
    category: 'emphasis',
    animation: {
      name: 'Shake',
      trigger: 'onHover',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'translateX(0)'
          }
        },
        {
          time: 0.1,
          properties: {
            transform: 'translateX(-10px)'
          }
        },
        {
          time: 0.2,
          properties: {
            transform: 'translateX(10px)'
          }
        },
        {
          time: 0.3,
          properties: {
            transform: 'translateX(-10px)'
          }
        },
        {
          time: 0.4,
          properties: {
            transform: 'translateX(10px)'
          }
        },
        {
          time: 0.5,
          properties: {
            transform: 'translateX(-10px)'
          }
        },
        {
          time: 0.6,
          properties: {
            transform: 'translateX(10px)'
          }
        },
        {
          time: 0.7,
          properties: {
            transform: 'translateX(-10px)'
          }
        },
        {
          time: 0.8,
          properties: {
            transform: 'translateX(10px)'
          }
        },
        {
          time: 0.9,
          properties: {
            transform: 'translateX(-5px)'
          }
        },
        {
          time: 1,
          properties: {
            transform: 'translateX(0)'
          }
        }
      ],
      options: {
        duration: 500,
        delay: 0,
        easing: 'ease-in-out'
      }
    }
  },
  
  // Hover Animations
  {
    id: 'hover-grow',
    name: 'Grow on Hover',
    category: 'hover',
    animation: {
      name: 'Grow on Hover',
      trigger: 'onHover',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'scale(1)'
          }
        },
        {
          time: 1,
          properties: {
            transform: 'scale(1.1)'
          }
        }
      ],
      options: {
        duration: 300,
        delay: 0,
        easing: 'ease-out'
      }
    }
  },
  {
    id: 'hover-lift',
    name: 'Lift on Hover',
    category: 'hover',
    animation: {
      name: 'Lift on Hover',
      trigger: 'onHover',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'translateY(0)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        },
        {
          time: 1,
          properties: {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
          }
        }
      ],
      options: {
        duration: 300,
        delay: 0,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  
  // Continuous Animations
  {
    id: 'float',
    name: 'Float',
    category: 'continuous',
    animation: {
      name: 'Float',
      trigger: 'continuous',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'translateY(0)'
          }
        },
        {
          time: 0.5,
          properties: {
            transform: 'translateY(-20px)'
          }
        },
        {
          time: 1,
          properties: {
            transform: 'translateY(0)'
          }
        }
      ],
      options: {
        duration: 3000,
        delay: 0,
        easing: 'ease-in-out',
        loop: true,
        direction: 'alternate'
      }
    }
  },
  {
    id: 'spin',
    name: 'Spin',
    category: 'continuous',
    animation: {
      name: 'Spin',
      trigger: 'continuous',
      timeline: [
        {
          time: 0,
          properties: {
            transform: 'rotate(0deg)'
          }
        },
        {
          time: 1,
          properties: {
            transform: 'rotate(360deg)'
          }
        }
      ],
      options: {
        duration: 2000,
        delay: 0,
        easing: 'linear',
        loop: true
      }
    }
  },
  
  // Scroll Triggered
  {
    id: 'scroll-fade-in',
    name: 'Fade In on Scroll',
    category: 'entrance',
    animation: {
      name: 'Fade In on Scroll',
      trigger: 'onScroll',
      timeline: [
        {
          time: 0,
          properties: {
            opacity: 0,
            transform: 'translateY(30px)'
          }
        },
        {
          time: 1,
          properties: {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      ],
      options: {
        duration: 1000,
        delay: 0,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      scrollOptions: {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    }
  },
  {
    id: 'scroll-scale',
    name: 'Scale on Scroll',
    category: 'entrance',
    animation: {
      name: 'Scale on Scroll',
      trigger: 'onScroll',
      timeline: [
        {
          time: 0,
          properties: {
            opacity: 0,
            transform: 'scale(0.8)'
          }
        },
        {
          time: 1,
          properties: {
            opacity: 1,
            transform: 'scale(1)'
          }
        }
      ],
      options: {
        duration: 800,
        delay: 0,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      scrollOptions: {
        threshold: 0.3
      }
    }
  }
];

export function createAnimationFromPreset(preset: AnimationPreset): Animation {
  return {
    id: nanoid(8),
    ...preset.animation
  };
}